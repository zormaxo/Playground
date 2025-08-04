using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Analision.Web.Public.Views;

public abstract class AnalisionRazorPage<TModel> : AbpRazorPage<TModel>
{
    [RazorInject]
    public IAbpSession AbpSession { get; set; }

    protected AnalisionRazorPage()
    {
        LocalizationSourceName = AnalisionConsts.LocalizationSourceName;
    }
}

