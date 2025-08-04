using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Configuration;

namespace Analision.Timing;

public interface ITimeZoneService
{
    Task<string> GetDefaultTimezoneAsync(SettingScopes scope, int? tenantId);

    TimeZoneInfo FindTimeZoneById(string timezoneId);

    List<NameValueDto> GetWindowsTimezones();

    void ValidateTimezone(string timeZone);
}

