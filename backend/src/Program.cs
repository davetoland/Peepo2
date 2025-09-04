using Microsoft.Extensions.Hosting;
using Microsoft.Azure.Functions.Worker.Configuration;
using Azure.Data.Tables;
using Azure.Storage.Queues;
using PeepoBackend.Contracts;
using PeepoBackend.Models;
using PeepoBackend.Services;
using Microsoft.Extensions.DependencyInjection;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((ctx, services) =>
    {
        var cfg = ctx.Configuration;
        var isDev = cfg["ASPNETCORE_ENVIRONMENT"] == "Development";

        services.AddOptions<AppOptions>()
            .Bind(cfg) // flat values from local.settings.json / app settings
            .Validate(o => !string.IsNullOrEmpty(o.AllowedOrigins), "AllowedOrigins cannot be blank")
            .Validate(o => !string.IsNullOrWhiteSpace(o.ContactTo), "ContactTo required")
            .Validate(o => !string.IsNullOrWhiteSpace(o.ContactFrom), "ContactFrom required")
            .Validate(o => !string.IsNullOrWhiteSpace(o.PublicBaseUrl), "PublicBaseUrl required")
            .ValidateOnStart();

        services.AddHttpClient();

        if (isDev)
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
        services.AddSingleton(new QueueClient(storageConn, "rate-limit-purge"));

        // // App settings
        // services.AddSingleton(new AppOptions
        // {
        //     AllowedOrigin = Environment.GetEnvironmentVariable("AllowedOrigin")!,
        //     TurnstileSiteKey = Environment.GetEnvironmentVariable("TurnstileSiteKey")!,
        //     TurnstileSecretName = "Turnstile-Secret",
        //     EmailProviderSecretName = "Email-Provider",
        //     SendGridKeySecretName = "SendGridApiKey",
        //     ConfirmKeySecretName = "ConfirmTokenKey",
        //     ContactTo = Environment.GetEnvironmentVariable("ContactTo")!,
        //     ContactFrom = Environment.GetEnvironmentVariable("ContactFrom")!,
        //     ContactFromName = Environment.GetEnvironmentVariable("ContactFromName")!,
        //     PublicBaseUrl = Environment.GetEnvironmentVariable("PublicBaseUrl")! // e.g. https://api.example.com
        // });

        // Services
        services.AddSingleton<ITurnstileService, TurnstileService>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IRateLimitService, RateLimitService>();
    })
    .Build();

await host.RunAsync();
