using Microsoft.Extensions.AI;

namespace AI.Net;

public class ChatService(IChatClient chatClient) : IChatService
{
    public async Task StartChatAsync()
    {
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
                var response = await chatClient.GetResponseAsync(userInput);
                Console.WriteLine($"AI: {response}");
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine();
            }
        }
    }
}
