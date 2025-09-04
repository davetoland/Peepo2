using FluentResults;
using Microsoft.Extensions.Options;
using PeepoBackend.Contracts;
using PeepoBackend.Models;
using PeepoBackend.Utils;

namespace PeepoBackend.Services;

public sealed class EmailService(ISecretReader secrets, IOptions<AppOptions> opt) : IEmailService
{
    private readonly AppOptions _opts = opt.Value;
    private string? _sendGridKey;

    public async Task<Result> SendContactAsync(string fromEmail, string message)
    {
        var apiKeyResult = await GetSendGridApiKey();
        if (apiKeyResult.IsFailed)
            return Result.Fail("Could not retrieve SendGrid Key");

        var sg = new SendGrid.SendGridClient(apiKeyResult.Value);
        var mail = new SendGrid.Helpers.Mail.SendGridMessage
        {
            From = new(_opts.ContactFrom, _opts.ContactFromName),
            Subject = "[Website Contact] New message",
            PlainTextContent = $"From: {fromEmail}\n\n{TextSanitiser.Sanitise(message)}"
        };
        mail.AddTo(_opts.ContactTo);
        await sg.SendEmailAsync(mail);
        return Result.Ok();
    }

    public async Task<Result> SendConfirmAsync(string toEmail, string confirmUrl)
    {
        var apiKeyResult = await GetSendGridApiKey();
        if (apiKeyResult.IsFailed)
            return Result.Fail("Could not retrieve SendGrid Key");

        var client = new SendGrid.SendGridClient(apiKeyResult.Value);
        var mail = new SendGrid.Helpers.Mail.SendGridMessage
        {
            From = new(_opts.ContactFrom, _opts.ContactFromName),
            Subject = "Peepo Sensory: Confirm newsletter subscription",
            PlainTextContent = $"""
            Someone (hopefully you) subscribed you to the Peepo Sensory Newsletter.\n\n
            Please use this link to confirm your subscription:\n\n 
            {confirmUrl}
            """
        };
        mail.AddTo(toEmail);
        await client.SendEmailAsync(mail);
        return Result.Ok();
    }

    private async Task<Result<string>> GetSendGridApiKey()
    {
        if (_sendGridKey != null)
            return _sendGridKey;

        var secretResult = await secrets.GetAsync(_opts.SendGridKeySecretName);
        if (secretResult.IsFailed)
            return Result.Fail("Could not retrieve SendGrid Key");

        _sendGridKey = secretResult.Value;
        return _sendGridKey;
    }
}
