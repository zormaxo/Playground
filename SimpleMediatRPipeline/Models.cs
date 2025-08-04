using System;
using System.Threading.Tasks;

namespace SimpleMediatRPipeline
{
    // Base interfaces - MediatR'ın temel yapıları
    public interface IRequestHandler<TRequest, TResponse>
    {
        Task<TResponse> Handle(TRequest request);
    }

    // Pipeline behavior interface
    public interface IPipelineBehavior
    {
        Task<TResponse> Handle<TRequest, TResponse>(TRequest request, Func<Task<TResponse>> next);
    }

    // Domain modelleri
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // Query - Veri okuma operasyonu

    public class GetUserQuery
    {
        public int UserId { get; set; }
    }

    // Command - Veri değiştirme operasyonu
    public class CreateUserCommand
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
