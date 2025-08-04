using Microsoft.Extensions.DependencyInjection;

namespace SimpleMediatRPipeline;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("=== MediatR Pipeline Demo with DI ===\n"); // DI Container setup
        var services = new ServiceCollection();

        // Handler'ları kaydet
        services.AddScoped<IRequestHandler<GetUserQuery, User>, GetUserHandler>();
        services.AddScoped<IRequestHandler<CreateUserCommand, User>, CreateUserHandler>();

        // Behavior'ları kaydet (sıralama önemli!)
        services.AddScoped<IPipelineBehavior, LoggingBehavior>();
        services.AddScoped<IPipelineBehavior, ValidationBehavior>();
        services.AddScoped<IPipelineBehavior, PerformanceBehavior>();

        // Mediator'ı kaydet
        services.AddScoped<SimpleMediator>();

        var serviceProvider = services.BuildServiceProvider();

        // Mediator'ı DI'dan al
        var mediator = serviceProvider.GetRequiredService<SimpleMediator>();

        Console.WriteLine("🚀 Şimdi pipeline'ı çalışırken görelim:\n"); // Query örneği
        Console.WriteLine("1. Query Execution:");
        var getUserQuery = new GetUserQuery { UserId = 1 };
        var user = await mediator.Send<GetUserQuery, User>(getUserQuery);
        Console.WriteLine($"Result: {user.Name} ({user.Email})\n");

        // Command örneği
        Console.WriteLine("2. Command Execution:");
        var createUserCommand = new CreateUserCommand
        {
            Name = "Ahmet Yılmaz",
            Email = "ahmet@example.com",
        };
        var newUser = await mediator.Send<CreateUserCommand, User>(createUserCommand);
        Console.WriteLine($"Created User: {newUser.Name} ({newUser.Email})\n");

        // Hatalı komut örneği (validation fail)
        Console.WriteLine("3. Validation Error Example:");
        try
        {
            var invalidCommand = new CreateUserCommand
            {
                Name = "", // Boş isim - validation hatası verecek
                Email = "invalid-email",
            };
            await mediator.Send<CreateUserCommand, User>(invalidCommand);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}\n");
        }

        Console.WriteLine("✨ Demo tamamlandı! Pipeline'ın nasıl çalıştığını gördünüz.");
    }
}
