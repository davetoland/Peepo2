using System.Net.Http.Json;
using FluentResults;
using Microsoft.Extensions.Options;
using PeepoBackend.Contracts;
using PeepoBackend.Models;

namespace PeepoBackend.Services;

public sealed class TurnstileService(IHttpClientFactory http, ISecretReader secrets, IOptions<AppOptions> opt) : ITurnstileService
{
    private readonly AppOptions _opts = opt.Value;
    private string? _secretCache;

    private async Task<Result<string>> Secret()
    {
        if (_secretCache != null)
            return _secretCache.ToResult();

        var secretResult = await secrets.GetAsync(_opts.TurnstileSecretName);
        if (secretResult.IsFailed)
            return Result.Fail("Unable to obtain secret");

        _secretCache = secretResult.Value;
        return _secretCache.ToResult();
    }

    public async Task<Result<bool>> VerifyAsync(string token, string? remoteIp)
    {
        if (string.IsNullOrWhiteSpace(token))
            return false.ToResult();

        var secret = await Secret();
        if (secret.IsFailed)
            return false.ToResult();

        List<KeyValuePair<string,string>> nameValueCollection = [
            new ("secret", secret.Value),
            new ("response", token),
        ];

        if (!string.IsNullOrWhiteSpace(remoteIp))
            nameValueCollection.Add(new("remoteip", remoteIp));

        var form = new FormUrlEncodedContent(nameValueCollection);
        var client = http.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(5); // fail fast
        
        var res = await client.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", form);

        if (!res.IsSuccessStatusCode)
            return false.ToResult();

        var json = await res.Content.ReadFromJsonAsync<TurnstileResponse>();
        return (json?.Success ?? false).ToResult();
    }

    private sealed record TurnstileResponse(bool Success);
}
