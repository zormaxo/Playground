using Abp.Configuration;

namespace Analision.Timing.Dto;

public class GetTimezoneComboboxItemsInput
{
    public SettingScopes DefaultTimezoneScope;

    public string SelectedTimezoneId { get; set; }
}

