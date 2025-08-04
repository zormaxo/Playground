using Analision.Maui.Models.NavigationMenu;

namespace Analision.Maui.Services.Navigation;

public interface IMenuProvider
{
    List<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
}