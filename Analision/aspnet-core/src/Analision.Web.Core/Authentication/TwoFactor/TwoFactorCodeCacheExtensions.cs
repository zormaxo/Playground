using Abp.Runtime.Caching;
using Analision.Authentication.TwoFactor;

namespace Analision.Web.Authentication.TwoFactor;

public static class TwoFactorCodeCacheExtensions
{
    public static ITypedCache<string, TwoFactorCodeCacheItem> GetTwoFactorCodeCache(this ICacheManager cacheManager)
    {
        return cacheManager.GetCache<string, TwoFactorCodeCacheItem>(TwoFactorCodeCacheItem.CacheName);
    }
}

