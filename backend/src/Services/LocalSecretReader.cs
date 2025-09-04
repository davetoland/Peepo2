using FluentResults;
using Microsoft.Extensions.Configuration;
using PeepoBackend.Contracts;

namespace PeepoBackend.Services;

public sealed class LocalSecretReader(IConfiguration cfg) : ISecretReader
{
    public Task<Result<string>> GetAsync(string name)
    {
        var secret = cfg[name]
            ?? throw new ApplicationException($"Failed to retrieve secret: {name}");

        return Task.FromResult(secret.ToResult());
    }
}
