using Abp.Domain.Services;

namespace Analision.Authorization.Users.Password;

public interface IPasswordExpirationService : IDomainService
{
    void ForcePasswordExpiredUsersToChangeTheirPassword();
}

