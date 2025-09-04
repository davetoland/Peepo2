using System.Net;
using Microsoft.Azure.Functions.Worker.Http;

internal static class HttpReqExt
{
    public static string ClientIp(this HttpRequestData req)
    {
        // 1) Preferred in Azure (added by Front Door/App Gateway/App Service)
        if (req.Headers.TryGetValues("X-Azure-ClientIP", out var a) &&
            TryFirstIp(a.FirstOrDefault(), out var ip1)) return ip1;

        // 2) Standard proxy header: "client, proxy1, proxy2"
        if (req.Headers.TryGetValues("X-Forwarded-For", out var xff))
        {
            var first = xff.FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(first))
            {
                // take the first token before a comma
                var token = first.Split(',')[0].Trim();
                if (TryFirstIp(token, out var ip2)) return ip2;
            }
        }

        // 3) Some setups add this
        if (req.Headers.TryGetValues("X-Client-IP", out var xc) &&
            TryFirstIp(xc.FirstOrDefault(), out var ip3)) return ip3;

        return "0.0.0.0";
    }

    private static bool TryFirstIp(string? value, out string ip)
    {
        ip = "";
        if (string.IsNullOrWhiteSpace(value)) return false;

        // Handle IPv6 in brackets, quotes, or with port (rare)
        var v = value.Trim().Trim('"').Trim('[').Trim(']');
        var colonPort = v.LastIndexOf(':');
        if (colonPort > -1 && v.Count(c => c == ':') == 1) // likely IPv4:port
            v = v[..colonPort];

        if (IPAddress.TryParse(v, out var addr))
        {
            ip = addr.ToString();
            return true;
        }
        return false;
    }
}
