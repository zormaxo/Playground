using System;
using System.Threading.Tasks;

namespace SimpleMediatRPipeline
{
    // Query Handler - Kullanıcı bilgilerini getir
    public class GetUserHandler : IRequestHandler<GetUserQuery, User>
    {
        public async Task<User> Handle(GetUserQuery request)
        {
            Console.WriteLine($"   → GetUserHandler: Fetching user with ID {request.UserId}");

            // Simulated database call
            await Task.Delay(100);

            return new User
            {
                Id = request.UserId,
                Name = "John Doe",
                Email = "john@example.com",
            };
        }
    }

    // Command Handler - Yeni kullanıcı oluştur
    public class CreateUserHandler : IRequestHandler<CreateUserCommand, User>
    {
        private static int _nextId = 100;

        public async Task<User> Handle(CreateUserCommand request)
        {
            Console.WriteLine($"   → CreateUserHandler: Creating user {request.Name}");

            // Simulated database save
            await Task.Delay(150);

            return new User
            {
                Id = ++_nextId,
                Name = request.Name,
                Email = request.Email,
            };
        }
    }
}
