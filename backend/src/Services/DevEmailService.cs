using FluentResults;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using PeepoBackend.Contracts;
using PeepoBackend.Models;
using PeepoBackend.Utils;

namespace PeepoBackend.Services;

public sealed class DevEmailService(IConfiguration cfg, IOptions<AppOptions> opt) : IEmailService
{
    private readonly AppOptions _opts = opt.Value;
    private readonly string _host = cfg["MailHog:Host"] ?? "localhost";
    private readonly int _port = int.TryParse(cfg["MailHog:Port"], out var p) ? p : 1025;

    public async Task<Result> SendContactAsync(string fromEmail, string message)
    {
        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress(_opts.ContactFromName, _opts.ContactFrom));
        msg.To.Add(MailboxAddress.Parse(_opts.ContactTo));
        msg.Subject = "[Website Contact] New message";
        msg.Body = new TextPart("plain")
        {
            Text = $"From: {fromEmail}\n\n{TextSanitiser.Sanitise(message)}"
        };

        await SendAsync(msg);
        return Result.Ok();
    }

    public async Task<Result> SendConfirmAsync(string toEmail, string confirmUrl)
    {
        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress(_opts.ContactFromName, _opts.ContactFrom));
        msg.To.Add(MailboxAddress.Parse(toEmail));
        msg.Subject = "Peepo Sensory: Confirm newsletter subscription";
        msg.Body = new TextPart("plain")
        {
            Text = $"""
            Someone (hopefully you) subscribed you to the Peepo Sensory Newsletter.
            Please use this link to confirm your subscription:
            {confirmUrl}
            """
        };

        await SendAsync(msg);
        return Result.Ok();
    }

    private async Task SendAsync(MimeMessage msg)
    {
        using var smtp = new SmtpClient();
        // MailHog does not use TLS or auth by default
        await smtp.ConnectAsync(_host, _port, MailKit.Security.SecureSocketOptions.None);
        await smtp.SendAsync(msg);
        await smtp.DisconnectAsync(true);
    }
}
