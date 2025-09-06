using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PeepoBackend.Models;

namespace PeepoBackend.Functions;

public class CleanupOrchestrator
{
    [Function(nameof(CleanupOrchestrator))]
    public async Task Run([OrchestrationTrigger] TaskOrchestrationContext ctx)
    {
        await ctx.CallActivityAsync(nameof(DoCleanup), "");
    }
}

public class DoCleanup(TableServiceClient tables, IOptions<AppOptions> options)
{
    [Function(nameof(DoCleanup))]
    public async Task Run(
        [ActivityTrigger] string _,
        FunctionContext context)
    {
        var log = context.GetLogger(nameof(DoCleanup));
        log.LogInformation("Starting RateLimit cleanup");

        var cutoff = DateTime.UtcNow - TimeSpan.FromMinutes(options.Value.TablePurgeCutoffInMins);
        var tableClient = tables.GetTableClient("RateLimit");

        var count = 0;
        await foreach (var row in tableClient.QueryAsync<TableEntity>(filter: x => x.Timestamp >= cutoff))
        {
            await tableClient.DeleteEntityAsync(row.PartitionKey, row.RowKey);
            count++;
        }

        log.LogInformation("Cleanup complete, {count} rows cleaned.", count);
    }
}