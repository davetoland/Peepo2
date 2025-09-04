using FluentResults;

namespace PeepoBackend.Contracts;

public interface IEmailService
{
    Task<Result> SendConfirmAsync(string toEmail, string confirmUrl);
    Task<Result> SendContactAsync(string fromEmail, string message);
}
