using Azure;
using Azure.Data.Tables;
using FluentResults;

namespace PeepoBackend.Utils;

public static class TableUtils
{
    public static async Task<Result<TableEntity>> Get(TableClient tableClient, string pk, string rk)
    {
        try
        {
            await tableClient.CreateIfNotExistsAsync();
            var resp = await tableClient.GetEntityAsync<TableEntity>(pk, rk);
            return resp.Value.ToResult();
        }
        catch (RequestFailedException)
        {
            return Result.Fail("Bad Request");
        }
    }
}