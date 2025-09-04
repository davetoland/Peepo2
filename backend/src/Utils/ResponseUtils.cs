using System.Net;
using Microsoft.Azure.Functions.Worker.Http;

namespace PeepoBackend.Utils;

public static class ResponseUtils
{
    public static async ValueTask<HttpResponseData> Ok(HttpRequestData req, object body)
    {
        var r = req.CreateResponse(HttpStatusCode.OK);
        await r.WriteAsJsonAsync(body);
        return r;
    }

    public static async ValueTask<HttpResponseData> BadRequest(HttpRequestData req, string msg)
    {
        var r = req.CreateResponse(HttpStatusCode.BadRequest);
        await r.WriteStringAsync(msg);
        return r;
    }

    public static HttpResponseData Forbidden(HttpRequestData req)
        => req.CreateResponse(HttpStatusCode.Forbidden);

    public static HttpResponseData TooMany(HttpRequestData req)
        => req.CreateResponse((HttpStatusCode)429);

    public static HttpResponseData Error(HttpRequestData req)
        => req.CreateResponse(HttpStatusCode.InternalServerError);
}