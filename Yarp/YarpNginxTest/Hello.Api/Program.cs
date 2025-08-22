var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet(
        "/hello",
        () =>
        {
            return Results.Ok("Hello, World!");
        }
    )
    .WithName("GetHelloWorld");

app.Run();
