using System.Threading.Tasks;

namespace Analision.Security;

public interface IPasswordComplexitySettingStore
{
    Task<PasswordComplexitySetting> GetSettingsAsync();
}

