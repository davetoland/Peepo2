using System.Security.Cryptography;
using System.Text;
using FluentResults;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PeepoBackend.Contracts;
using PeepoBackend.Models;

namespace PeepoBackend.Services;

public sealed class TokenService(ISecretReader secrets, IOptions<AppOptions> opt, ILogger<TokenService> log) : ITokenService
{
    private byte[]? _key;
    private DateTimeOffset _keyExpiresAt;
    private readonly AppOptions _opts = opt.Value;
    private static readonly TimeSpan KeyTtl = TimeSpan.FromHours(12);
    private static readonly TimeSpan MaxTokenTtl = TimeSpan.FromDays(2);
    private const int MaxTokenChars = 2048;

    private async Task<byte[]> KeyAsync()
    {
        if (_key is not null && DateTimeOffset.UtcNow < _keyExpiresAt)
            return _key;

        var secret = await secrets.GetAsync(_opts.ConfirmKeySecretName);
        if (secret.IsFailed)
            throw new ApplicationException($"Secret missing: {_opts.ConfirmKeySecretName}");

        _key = Convert.FromBase64String(secret.Value);
        _keyExpiresAt = DateTimeOffset.UtcNow + KeyTtl;
        log.LogInformation("Reloaded confirm token key from secrets; next refresh at {ExpiresAt:u}", _keyExpiresAt);
        return _key;
    }

    public async Task<string> IssueAsync(string email, TimeSpan ttl)
    {
        if (ttl > MaxTokenTtl)
            ttl = MaxTokenTtl;            
            
        var norm = email.Trim().ToLowerInvariant();
        var exp = DateTimeOffset.UtcNow.Add(ttl).ToUnixTimeSeconds();
        var payload = $"{norm}|{exp}";
        var hmac = await ComputeHmacBytesAsync(payload);
        return ToBase64($"{payload}|{Convert.ToHexString(hmac)}");
    }

    public async Task<Result<string>> VerifyAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token) || token.Length > MaxTokenChars)
            return Result.Fail("Token invalid");

        try
        {
            var decoded = FromBase64(token);
            var parts = decoded.Split('|');
            if (parts.Length != 3)
                return Result.Fail("Could not decode token");

            var email = parts[0];
            if (!long.TryParse(parts[1], out var exp))
                return Result.Fail("Bad exp");

            if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > exp)
                return Result.Fail("Token has expired");

            var payload = $"{parts[0]}|{parts[1]}";
            var expectedMac = await ComputeHmacBytesAsync(payload);

            if (!TryHexToBytes(parts[2], out var providedMac))
                return Result.Fail("Bad signature format");

            if (!CryptographicOperations.FixedTimeEquals(providedMac, expectedMac))
                return Result.Fail("Signing failure");

            return email.ToResult();
        }
        catch (Exception ex)
        {
            return Result.Fail(ex.Message);
        }
    }

    private async Task<byte[]> ComputeHmacBytesAsync(string payload)
    {
        using var h = new HMACSHA256(await KeyAsync());
        return h.ComputeHash(Encoding.UTF8.GetBytes(payload));
    }

    private static bool TryHexToBytes(string hex, out byte[] bytes)
    {
        try
        {
            bytes = Convert.FromHexString(hex);
            return true;
        }
        catch
        {
            bytes = [];
            return false;
        }
    }

    private static string ToBase64(string s)
        => Convert.ToBase64String(Encoding.UTF8.GetBytes(s)).Replace('+', '-').Replace('/', '_').TrimEnd('=');

    private static string FromBase64(string s)
    {
        var incoming = s.Replace('-', '+').Replace('_', '/');
        switch (incoming.Length % 4)
        {
            case 2:
                incoming += "==";
                break;
            case 3:
                incoming += "=";
                break;
        }
        return Encoding.UTF8.GetString(Convert.FromBase64String(incoming));
    }
}
