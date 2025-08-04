using Abp.Authorization;
using Analision.Authorization.Roles;
using Analision.Authorization.Users;

namespace Analision.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {

    }
}

