using System.Net;
using System.Text.Json;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using PeepoBackend.Contracts;
using PeepoBackend.Models;
using PeepoBackend.Utils;

namespace PeepoBackend;

public sealed class Endpoints(
    TableServiceClient tables,
    IOptions<AppOptions> options,
    ITurnstileService turnstile,
    IRateLimitService rateLimiter,
    IEmailService emailer,
    ITokenService tokens)
{
    private static readonly JsonSerializerOptions serializerOptions = new(JsonSerializerDefaults.Web);

    [Function("contact")]
    public async Task<HttpResponseData> Contact(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequestData req,
        FunctionContext ctx)
    {
        var appOptions = options.Value;
        var isValid = await RequestUtil.ValidateRequest(req, appOptions.Origins, turnstile);
        if (!isValid)
            return ResponseUtils.Forbidden(req);

        var body = await JsonSerializer.DeserializeAsync<ContactDto>(req.Body, serializerOptions);
        if (!ValidateBody())
            return await ResponseUtils.BadRequest(req, "invalid input");

        // rate limit
        var ipKey = $"ip:{req.ClientIp()}|contact";
        var allow = await rateLimiter.AllowAsync(ipKey, "contact", 2, TimeSpan.FromMinutes(10));
        if (!allow)
            return ResponseUtils.TooMany(req);

        var result = await emailer.SendContactAsync(body!.Email, body.Message); //msg sanitised by service
        if (result.IsFailed)
            return ResponseUtils.Error(req);

        return await ResponseUtils.Ok(req, new
        {
            ok = true
        });

        bool ValidateBody()
         => body is not null &&
            System.Net.Mail.MailAddress.TryCreate(body.Email, out _) &&
            !string.IsNullOrWhiteSpace(body.Message) &&
            body.Message.Length < 4000;
    }

    [Function("subscribe")]
    public async Task<HttpResponseData> Subscribe(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "subscribe")] HttpRequestData req,
        FunctionContext ctx)
    {
        var appOptions = options.Value;
        var isValid = await RequestUtil.ValidateRequest(req, appOptions.Origins, turnstile);
        if (!isValid)
            return ResponseUtils.Forbidden(req);

        var body = await JsonSerializer.DeserializeAsync<SubscribeDto>(req.Body, serializerOptions);
        if (body is null || !System.Net.Mail.MailAddress.TryCreate(body.Email, out _))
            return await ResponseUtils.BadRequest(req, "invalid email");

        // rate limit
        var ipKey = $"ip:{req.ClientIp()}|subscribe";
        var allow = await rateLimiter.AllowAsync(ipKey, "subscribe", 1, TimeSpan.FromDays(1));
        if (!allow)
            return ResponseUtils.TooMany(req);

        var email = body.Email.ToLowerInvariant();
        var tableClient = tables.GetTableClient("Subscriptions");
        var existing = await TableUtils.Get(tableClient, "sub", email);

        // Idempotent success for Active (no mail sent)
        if (existing.IsSuccess && existing.Value.GetString("Status") == "Active")
            return await ResponseUtils.Ok(req, new
            {
                ok = true
            });

        // Idempotent success for Suppressed (no mail sent)
        if (existing.IsSuccess && existing.Value.GetString("Status") == "Suppressed")
            return await ResponseUtils.Ok(req, new
            {
                ok = true
            });

        var entity = existing.ValueOrDefault ?? new TableEntity("sub", email) { ["CreatedUtc"] = DateTime.UtcNow };
        entity["Status"] = "Pending";
        await tableClient.UpsertEntityAsync(entity);

        var token = await tokens.IssueAsync(email, TimeSpan.FromHours(24));
        var confirmUrl = $"{options.Value.PublicBaseUrl}/subscribe/confirm?token={Uri.EscapeDataString(token)}";
        var result = await emailer.SendConfirmAsync(email, confirmUrl);
        if (result.IsFailed)
            return ResponseUtils.Error(req);

        return await ResponseUtils.Ok(req, new
        {
            ok = true
        });
    }

    [Function("confirm")]
    public async Task<HttpResponseData> Confirm(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "subscribe/confirm")] HttpRequestData req)
    {
        var token = System.Web.HttpUtility.ParseQueryString(req.Url.Query).Get("token");
        if (string.IsNullOrEmpty(token))
            return await ResponseUtils.BadRequest(req, "missing token");

        var verification = await tokens.VerifyAsync(token);
        if (verification.IsFailed)
            return await ResponseUtils.BadRequest(req, "invalid token");

        var tableClient = tables.GetTableClient("Subscriptions");
        var rowKey = verification.Value.ToLowerInvariant();
        var entityResult = await TableUtils.Get(tableClient, "sub", rowKey);
        var entity = entityResult.IsSuccess
            ? entityResult.Value
            : new TableEntity("sub", rowKey);

        entity["Status"] = "Active";
        entity["ConfirmedUtc"] = DateTime.UtcNow;
        await tableClient.UpsertEntityAsync(entity);

        var resp = req.CreateResponse(HttpStatusCode.Redirect);
        resp.Headers.Add("Location", "/subscribed"); // subscription confirmation page
        return resp;
    }
}

public record ContactDto(string Email, string Message);

public record SubscribeDto(string Email);
