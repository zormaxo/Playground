using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Analision.Authentication.TwoFactor.Google;
using Analision.Authorization;
using Analision.Authorization.Roles;
using Analision.Authorization.Users;
using Analision.Editions;
using Analision.MultiTenancy;

namespace Analision.Identity;

public static class IdentityRegistrar
{
    public static IdentityBuilder Register(IServiceCollection services)
    {
        services.AddLogging();

        return services.AddAbpIdentity<Tenant, User, Role>(options =>
            {
                options.Tokens.ProviderMap[GoogleAuthenticatorProvider.Name] = new TokenProviderDescriptor(typeof(GoogleAuthenticatorProvider));
            })
            .AddAbpTenantManager<TenantManager>()
            .AddAbpUserManager<UserManager>()
            .AddAbpRoleManager<RoleManager>()
            .AddAbpEditionManager<EditionManager>()
            .AddAbpUserStore<UserStore>()
            .AddAbpRoleStore<RoleStore>()
            .AddAbpSignInManager<SignInManager>()
            .AddAbpUserClaimsPrincipalFactory<UserClaimsPrincipalFactory>()
            .AddAbpSecurityStampValidator<SecurityStampValidator>()
            .AddPermissionChecker<PermissionChecker>()
            .AddDefaultTokenProviders();
    }
}

