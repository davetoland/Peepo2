using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FluentResults;
using Microsoft.Extensions.Configuration;
using PeepoBackend.Contracts;

namespace PeepoBackend.Services;

public sealed class KeyVaultSecretReader(IConfiguration cfg) : ISecretReader
{
    private readonly Lazy<SecretClient> _secretClient = new(() =>
    {
        var _keyVaultUrl = cfg["KeyVaultUrl"] ?? throw new InvalidOperationException("KeyVaultUrl missing");
        return new(new Uri(_keyVaultUrl), new DefaultAzureCredential());
    });

    public async Task<Result<string>> GetAsync(string name)
    {
        var secret = await _secretClient.Value.GetSecretAsync(name);
        if (secret == null)
            return Result.Fail($"Failed to retrieve secret: {name}");

        return secret.Value.Value.ToResult();
    }
}
