using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AI.Net;

// Hosted Service Implementation - Background service that runs the chat service
internal class ChatHostedService(
    IChatService chatService,
    ILogger<ChatHostedService> logger,
    IHostApplicationLifetime appLifetime
) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            logger.LogInformation("Chat service starting...");
            await chatService.StartChatAsync();
        }
        catch (OperationCanceledException ex)
        {
            // Expected when cancellation is requested
            logger.LogInformation(ex, "Chat service was cancelled");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Critical error occurred in chat service. Application will stop.");
            // Gracefully stop the application instead of throwing
            appLifetime.StopApplication();
        }
        finally
        {
            // When chat ends, gracefully shut down the application
            appLifetime.StopApplication();
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("Chat service stopping...");
        await base.StopAsync(cancellationToken);
    }
}
