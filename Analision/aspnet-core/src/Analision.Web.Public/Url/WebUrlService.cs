using Abp.Dependency;
using Analision.Configuration;
using Analision.Url;
using Analision.Web.Url;

namespace Analision.Web.Public.Url;

public class WebUrlService : WebUrlServiceBase, IWebUrlService, ITransientDependency
{
    public WebUrlService(
        IAppConfigurationAccessor appConfigurationAccessor) :
        base(appConfigurationAccessor)
    {
    }

    public override string WebSiteRootAddressFormatKey => "App:WebSiteRootAddress";

    public override string ServerRootAddressFormatKey => "App:AdminWebSiteRootAddress";
}

