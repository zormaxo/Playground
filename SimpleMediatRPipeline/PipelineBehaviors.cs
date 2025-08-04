using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SimpleMediatRPipeline
{
    // 1. Logging Behavior - Her request'i logla
    public class LoggingBehavior : IPipelineBehavior
    {
        public async Task<TResponse> Handle<TRequest, TResponse>(
            TRequest request,
            Func<Task<TResponse>> next
        )
        {
            var requestName = typeof(TRequest).Name;
            Console.WriteLine($"🔍 [LOG] Starting {requestName}");

            try
            {
                var response = await next();
                Console.WriteLine($"✅ [LOG] Completed {requestName} successfully");
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [LOG] Failed {requestName}: {ex.Message}");
                throw;
            }
        }
    }

    // 2. Validation Behavior - Request'leri doğrula
    public class ValidationBehavior : IPipelineBehavior
    {
        public async Task<TResponse> Handle<TRequest, TResponse>(
            TRequest request,
            Func<Task<TResponse>> next
        )
        {
            Console.WriteLine($"🔒 [VALIDATION] Validating {typeof(TRequest).Name}");

            // Basit validation logic
            if (request is CreateUserCommand createCmd)
            {
                if (string.IsNullOrWhiteSpace(createCmd.Name))
                    throw new ArgumentException("User name cannot be empty");

                if (string.IsNullOrWhiteSpace(createCmd.Email) || !createCmd.Email.Contains("@"))
                    throw new ArgumentException("Valid email is required");
            }

            if (request is GetUserQuery getUserQuery)
            {
                if (getUserQuery.UserId <= 0)
                    throw new ArgumentException("User ID must be positive");
            }

            Console.WriteLine($"✅ [VALIDATION] {typeof(TRequest).Name} is valid");
            return await next();
        }
    }

    // 3. Performance Behavior - Performans ölçümü
    public class PerformanceBehavior : IPipelineBehavior
    {
        public async Task<TResponse> Handle<TRequest, TResponse>(
            TRequest request,
            Func<Task<TResponse>> next
        )
        {
            var requestName = typeof(TRequest).Name;
            var stopwatch = Stopwatch.StartNew();

            Console.WriteLine($"⏱️  [PERFORMANCE] Starting timing for {requestName}");

            try
            {
                var response = await next();
                stopwatch.Stop();

                Console.WriteLine(
                    $"⚡ [PERFORMANCE] {requestName} completed in {stopwatch.ElapsedMilliseconds}ms"
                );

                if (stopwatch.ElapsedMilliseconds > 200)
                {
                    Console.WriteLine(
                        $"⚠️  [PERFORMANCE] WARNING: {requestName} took longer than expected!"
                    );
                }

                return response;
            }
            catch
            {
                stopwatch.Stop();
                Console.WriteLine(
                    $"💥 [PERFORMANCE] {requestName} failed after {stopwatch.ElapsedMilliseconds}ms"
                );
                throw;
            }
        }
    }
}
