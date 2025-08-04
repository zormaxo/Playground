using Abp.AspNetCore.Mvc.Views;

namespace Analision.Web.Views;

public abstract class AnalisionRazorPage<TModel> : AbpRazorPage<TModel>
{
    protected AnalisionRazorPage()
    {
        LocalizationSourceName = AnalisionConsts.LocalizationSourceName;
    }
}

