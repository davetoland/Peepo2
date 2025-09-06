using Microsoft.Extensions.Hosting;
using Azure.Data.Tables;
using PeepoBackend.Contracts;
using PeepoBackend.Models;
using PeepoBackend.Services;
using Microsoft.Extensions.DependencyInjection;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((ctx, services) =>
    {
        var cfg = ctx.Configuration;
        services.AddOptions<AppOptions>()
            .Bind(cfg)
            .Validate(o => !string.IsNullOrEmpty(o.AllowedOrigins), "AllowedOrigins cannot be blank")
            .Validate(o => !string.IsNullOrWhiteSpace(o.ContactTo), "ContactTo required")
            .Validate(o => !string.IsNullOrWhiteSpace(o.ContactFrom), "ContactFrom required")
            .Validate(o => !string.IsNullOrWhiteSpace(o.PublicBaseUrl), "PublicBaseUrl required")
            .ValidateOnStart();

        services.AddHttpClient();

        if (cfg["ASPNETCORE_ENVIRONMENT"] == "Development")
        {
            services.AddSingleton<ISecretReader, LocalSecretReader>();  // read from local.settings.json
            services.AddSingleton<IEmailService, DevEmailService>();    // MailHog
        }
        else
        {
            services.AddSingleton<ISecretReader, KeyVaultSecretReader>();
            services.AddSingleton<IEmailService, EmailService>();       // SendGrid
        }

        // Storage Tables
        var storageConn = Environment.GetEnvironmentVariable("AzureWebJobsStorage")!;
        services.AddSingleton(new TableServiceClient(storageConn));

        // Services
        services.AddSingleton<ITurnstileService, TurnstileService>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IRateLimitService, RateLimitService>();
    })
    .Build();

await host.RunAsync();
