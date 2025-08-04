using Microsoft.AspNetCore.Components;
using Analision.Maui.Core.Components;
using Analision.Maui.Core.Threading;
using Analision.Maui.Services.UI;


namespace Analision.Maui.Pages.MySettings;

public partial class ThemeSwitch : AnalisionComponentBase
{
    private string _selectedTheme = ThemeService.GetUserTheme();

    private string[] _themes = ThemeService.GetAllThemes();

    public string SelectedTheme
    {
        get => _selectedTheme;
        set
        {
            _selectedTheme = value;
            AsyncRunner.Run(ThemeService.SetUserTheme(JS, SelectedTheme));
        }
    }
}