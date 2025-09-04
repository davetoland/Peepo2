namespace PeepoBackend.Models;

public sealed class AppOptions
{
    public string AllowedOrigins { get; set; } = "";
    public ICollection<string> Origins
    {
        get => AllowedOrigins.Split(";", StringSplitOptions.RemoveEmptyEntries);
    }
    public string PublicBaseUrl { get; init; } = "";
    public string ContactTo { get; init; } = "";
    public string ContactFrom { get; init; } = "";
    public string ContactFromName { get; init; } = "";
    public MailHogOptions MailHog { get; init; } = new();
    public string TurnstileSiteKey { get; init; } = "";
    public string TurnstileSecretName { get; init; } = "";
    public string ConfirmTokenKey { get; init; } = "";
    public string ConfirmKeySecretName { get; init; } = "";
    public string SendGridKeySecretName { get; init; } = "";
    public int TablePurgeCutoffInMins { get; set; }
}
