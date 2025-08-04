using System.Globalization;

namespace Analision.Localization;

public interface IApplicationCulturesProvider
{
    CultureInfo[] GetAllCultures();
}

