using Microsoft.Azure.Functions.Worker.Http;
using PeepoBackend.Contracts;

namespace PeepoBackend.Utils;

public static class RequestUtil
{
    public static async Task<bool> ValidateRequest(HttpRequestData req, ICollection<string> origins, ITurnstileService turnstile)
    {
        // Origin check is strict ==. That means https://example.com will match, but https://example.com/whatever 
        // from Referer only matches because of GetLeftPart(UriPartial.Authority). That’s fine, just make sure 
        // AllowedOrigin config is exactly the origin.
        var origin = req.Headers.TryGetValues("Origin", out var o) ? o.FirstOrDefault() : null;
        var referer = req.Headers.TryGetValues("Referer", out var r) ? r.FirstOrDefault() : null;

        if (string.IsNullOrEmpty(origin) || string.IsNullOrEmpty(referer))
            return false;

        if (!origins.Contains(origin))
            return false;

        var authority = new Uri(referer).GetLeftPart(UriPartial.Authority);
        if (!origins.Contains(authority))
            return false;

        if (!req.Headers.TryGetValues("X-Turnstile-Token", out var value) || value?.FirstOrDefault() == null)
            return false;

        var verification = await turnstile.VerifyAsync(value!.First(), req.ClientIp());
        if (verification.IsFailed)
            return false;

        return true;
    }
}