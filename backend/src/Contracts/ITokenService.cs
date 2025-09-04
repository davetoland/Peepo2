using FluentResults;

namespace PeepoBackend.Contracts;

public interface ITokenService
{
    Task<string> IssueAsync(string email, TimeSpan ttl);
    Task<Result<string>> VerifyAsync(string token);
}
