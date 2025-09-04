using FluentResults;

namespace PeepoBackend.Contracts;

public interface ITurnstileService
{
    Task<Result<bool>> VerifyAsync(string token, string? remoteIp);
}
