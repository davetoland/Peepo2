namespace PeepoBackend.Contracts;

public interface IRateLimitService
{
    Task<bool> AllowAsync(string key, string action, int limit, TimeSpan window);
}
