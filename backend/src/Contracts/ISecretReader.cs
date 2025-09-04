using FluentResults;

namespace PeepoBackend.Contracts;

public interface ISecretReader
{
    Task<Result<string>> GetAsync(string name);
}
