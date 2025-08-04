using Abp;
using Analision.Maui.Core;

namespace Analision.Maui.NativeMauiComponents;

public partial class AnalisionNativeMauiComponentBase : ContentPage
{
    public AnalisionNativeMauiComponentBase()
    {
        InitializeComponent();
    }

    protected static T Resolve<T>()
    {
        return DependencyResolver.Resolve<T>();
    }

    protected string L(string text)
    {
        return Core.Localization.L.Localize(text);
    }

    protected Page GetMainPage()
    {
        var mainPage = Application.Current?.Windows[0].Page;

        if (mainPage is null)
        {
            throw new AbpException("Main page is not set yet.");
        }

        return mainPage;
    }
}