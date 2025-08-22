using AI.Net;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

// .NET 9 Modern Top-Level Statements Pattern
var builder = Host.CreateApplicationBuilder(args);

// User Secrets configuration
builder.Configuration.AddUserSecrets(typeof(Program).Assembly);

// Get configuration values with error handling
var openAiApiKey =
    builder.Configuration["OpenAI:ApiKey"]
    ?? throw new InvalidOperationException(
        "OpenAI API key not found. Please set it using: dotnet user-secrets set OpenAI:ApiKey <your-key>"
    );
var openAiModel = builder.Configuration["OpenAI:Model"] ?? "gpt-4o-mini";

// Register services with Microsoft.Extensions.AI
builder.Services.AddChatClient(new OpenAI.Chat.ChatClient(openAiModel, openAiApiKey).AsIChatClient());
builder.Services.AddSingleton<IChatService, ChatService>();
builder.Services.AddHostedService<ChatHostedService>();

// Build the host
var host = builder.Build();

// Log startup information
var logger = host.Services.GetRequiredService<ILogger<Program>>();
var environment = host.Services.GetRequiredService<IHostEnvironment>();

logger.LogInformation("� Application starting in {Environment} environment", environment.EnvironmentName);
logger.LogInformation("🤖 Using OpenAI model: {Model}", openAiModel);

try
{
    await host.RunAsync();
}
catch (Exception ex)
{
    logger.LogCritical(ex, "❌ Application failed to start");
    Environment.Exit(1);
}
