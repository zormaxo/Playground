var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddHealthChecks();

// Configure HTTPS redirection to use the correct external port
builder.Services.AddHttpsRedirection(options =>
{
    if (builder.Environment.EnvironmentName.Equals("Docker", StringComparison.OrdinalIgnoreCase))
    {
        options.HttpsPort = 5443; // External HTTPS port for Docker
    }
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapReverseProxy();
app.MapHealthChecks("/health");

app.Run();
