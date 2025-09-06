using Azure.Data.Tables;
using PeepoBackend.Contracts;

namespace PeepoBackend.Services;

public sealed class RateLimitService(TableServiceClient tables) : IRateLimitService
{
    public async Task<bool> AllowAsync(string key, string action, int limit, TimeSpan window)
    {
        var tableClient = tables.GetTableClient("RateLimit");
        await tableClient.CreateIfNotExistsAsync();
        var cutoff = DateTime.UtcNow - window;

        // check if the table has any entries
        string? filter = null;
        await foreach (var _ in tableClient.QueryAsync<TableEntity>(filter, maxPerPage: 1))
        {
            // Count recent
            int count = 0;
            await foreach (var __ in tableClient.QueryAsync<TableEntity>(filter: x => x.PartitionKey == key && x.Timestamp >= cutoff))
                if (++count >= limit)
                    return false;
        }        

        // if there were no entries, or the count is under limit, create an entry
        var row = new TableEntity(key, DateTime.UtcNow.Ticks.ToString("D19"));
        await tableClient.AddEntityAsync(row);
        return true;
    }
}
