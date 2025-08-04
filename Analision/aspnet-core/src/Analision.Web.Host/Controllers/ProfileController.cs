using Abp.AspNetCore.Mvc.Authorization;
using Analision.Authorization.Users.Profile;
using Analision.Storage;

namespace Analision.Web.Controllers;

[AbpMvcAuthorize]
public class ProfileController : ProfileControllerBase
{
    public ProfileController(
        ITempFileCacheManager tempFileCacheManager,
        IProfileAppService profileAppService) :
        base(tempFileCacheManager, profileAppService)
    {
    }
}

