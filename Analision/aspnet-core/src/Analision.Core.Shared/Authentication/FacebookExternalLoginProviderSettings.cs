using Abp.Extensions;

namespace Analision.Authentication;

public class FacebookExternalLoginProviderSettings
{
    public string AppId { get; set; }
    public string AppSecret { get; set; }

    public bool IsValid()
    {
        return !AppId.IsNullOrWhiteSpace() && !AppSecret.IsNullOrWhiteSpace();
    }
}

