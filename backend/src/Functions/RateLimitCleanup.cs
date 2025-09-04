using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Options;
using PeepoBackend.Models;

namespace PeepoBackend.Functions;

public class RateLimitCleanup(TableServiceClient tables, IOptions<AppOptions> options)
{
    [Function(nameof(PurgeRateLimitTable))]
    public async Task PurgeRateLimitTable([QueueTrigger("RateLimitPurge")] string _)
    {
        var cutoff = DateTime.UtcNow - TimeSpan.FromMinutes(options.Value.TablePurgeCutoffInMins);
        var tableClient = tables.GetTableClient("RateLimit");
        await foreach (var row in tableClient.QueryAsync<TableEntity>(filter: x => x.Timestamp >= cutoff))
            await tableClient.DeleteEntityAsync(row.PartitionKey, row.RowKey);
    }
}