using Azure;
using Azure.Data.Tables;
using Azure.Storage.Queues;
using FluentResults;

namespace PeepoBackend.Utils;

public static class QueueUtils
{
    public static async Task<Result> AddMessage(QueueClient queueClient, string message)
    {
        try
        {
            await queueClient.CreateIfNotExistsAsync();
            var resp = await queueClient.SendMessageAsync(message);
            return Result.Ok();
        }
        catch (RequestFailedException)
        {
            return Result.Fail("Bad Request");
        }
    }
}