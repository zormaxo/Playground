using Abp.Dependency;

namespace Analision.Maui.Services.UI;

public class LanguageService : ISingletonDependency
{
    public event EventHandler OnLanguageChanged;

    public void ChangeLanguage()
    {
        OnLanguageChanged?.Invoke(this, EventArgs.Empty);
    }
}