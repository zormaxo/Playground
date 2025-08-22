using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

// Build the host with dependency injection
var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(
        (context, services) =>
        {
            // Get OpenAI API key from environment
            var openAIApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");

            if (string.IsNullOrWhiteSpace(openAIApiKey))
            {
                throw new InvalidOperationException(
                    "OPENAI_API_KEY environment variable is not set."
                );
            }

            // Register ChatClient with OpenAI
            services.AddChatClient(services =>
                new OpenAI.Chat.ChatClient("gpt-4o-mini", openAIApiKey).AsIChatClient()
            );

            // Register our chat service
            services.AddScoped<IChatService, ChatService>();
        }
    )
    .Build();

// Get the chat service and run the chat
using var scope = host.Services.CreateScope();
var chatService = scope.ServiceProvider.GetRequiredService<IChatService>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
    logger.LogInformation("Starting AI Chat Console Application");
    await chatService.StartChatAsync();
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred while running the chat application");
}

// Interface for our chat service
public interface IChatService
{
    Task StartChatAsync();
}

// Implementation of our chat service
public class ChatService(IChatClient chatClient, ILogger<ChatService> logger) : IChatService
{
    public async Task StartChatAsync()
    {
        logger.LogInformation("Chat service started. Type 'exit' to quit.");
        Console.WriteLine("=== AI Chat Console ===");
        Console.WriteLine("Type your message and press Enter. Type 'exit' to quit.");
        Console.WriteLine();

        while (true)
        {
            Console.Write("You: ");
            var userInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(userInput))
                continue;

            if (userInput.Equals("exit", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("Goodbye!");
                break;
            }

            try
            {
                logger.LogDebug("Sending message to AI: {Message}", userInput);

                var response = await chatClient.GetResponseAsync(userInput);

                Console.WriteLine($"AI: {response}");
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while getting AI response");
                Console.WriteLine("Sorry, an error occurred while processing your request.");
                Console.WriteLine();
            }
        }
    }
}
