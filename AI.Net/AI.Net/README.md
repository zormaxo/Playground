## User Secrets in .NET

**Write a secret:**

```
dotnet user-secrets set OpenAI:ApiKey <your-key>
```

**List secrets:**

```
dotnet user-secrets list
```

User secrets are stored securely for development and accessed via configuration providers.

## Why Use HostedService?

A `HostedService` in .NET is used for running background tasks or long-running processes. In this project, it enables the chat service to start automatically with the application and run continuously, handling chat operations independently of HTTP requests or other entry points.
