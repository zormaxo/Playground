namespace SimpleMediatRPipeline;

// Basit Mediator implementasyonu - MediatR'ın temel mantığını gösterir
public class SimpleMediator(
    IServiceProvider serviceProvider,
    IEnumerable<IPipelineBehavior> behaviors
)
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IEnumerable<IPipelineBehavior> _behaviors = behaviors;

    // Handler kaydetme artık DI container tarafından yapılacak
    public void RegisterHandler<TRequest, TResponse>(IRequestHandler<TRequest, TResponse> handler)
    {
        throw new NotSupportedException("Use DI container for handler registration");
    }

    // Behavior kaydetme artık DI container tarafından yapılacak
    // Bu metod artık kullanılmayacak
    public void RegisterBehavior(IPipelineBehavior behavior)
    {
        throw new NotSupportedException("Use DI container for behavior registration");
    }

    // Ana Send metodu - DI ile entegre edilmiş
    public async Task<TResponse> Send<TRequest, TResponse>(TRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        // DI container'dan handler'ı al
        var handlerType = typeof(IRequestHandler<TRequest, TResponse>);

        if (
            _serviceProvider.GetService(handlerType)
            is not IRequestHandler<TRequest, TResponse> handler
        )
        {
            throw new InvalidOperationException(
                $"No handler registered for {typeof(TRequest).Name}"
            );
        }

        // Pipeline'ı oluştur - Type safe version
        Func<Task<TResponse>> pipeline = () => handler.Handle(request);

        // Behavior'ları ters sırada pipeline'a ekle
        // Bu sayede ilk eklenen behavior en dışta olur
        foreach (var behavior in _behaviors.Reverse())
        {
            var currentPipeline = pipeline;
            pipeline = () => behavior.Handle(request, currentPipeline);
        }

        // Pipeline'ı çalıştır
        return await pipeline();
    }
}
