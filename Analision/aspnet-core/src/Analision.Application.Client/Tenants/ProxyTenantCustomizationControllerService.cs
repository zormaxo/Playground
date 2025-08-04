using Analision.Authorization.Users.Profile.Dto;
using System.Threading.Tasks;

namespace Analision.Tenants;

public class ProxyTenantCustomizationControllerService : ProxyControllerBase
{
    public async Task<GetTenantLogoOutput> GetTenantLogoOrNull(int? tenantId, string skin = "light")
    {
        return await ApiClient.GetAnonymousAsync<GetTenantLogoOutput>(GetEndpoint(nameof(GetTenantLogoOrNull)), new { tenantId, skin });
    }
}

