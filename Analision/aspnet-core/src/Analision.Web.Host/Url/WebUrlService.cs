using Abp.Dependency;
using Analision.Configuration;
using Analision.Url;

namespace Analision.Web.Url;

public class WebUrlService : WebUrlServiceBase, IWebUrlService, ITransientDependency
{
    public WebUrlService(
        IAppConfigurationAccessor configurationAccessor) :
        base(configurationAccessor)
    {
    }

    public override string WebSiteRootAddressFormatKey => "App:ClientRootAddress";

    public override string ServerRootAddressFormatKey => "App:ServerRootAddress";
}

