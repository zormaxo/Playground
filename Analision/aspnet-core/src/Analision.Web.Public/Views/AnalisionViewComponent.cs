using Abp.AspNetCore.Mvc.ViewComponents;

namespace Analision.Web.Public.Views;

public abstract class AnalisionViewComponent : AbpViewComponent
{
    protected AnalisionViewComponent()
    {
        LocalizationSourceName = AnalisionConsts.LocalizationSourceName;
    }
}

