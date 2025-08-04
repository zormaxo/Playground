using Abp.AutoMapper;
using Analision.Sessions.Dto;

namespace Analision.Maui.Models.Common;

[AutoMapFrom(typeof(ApplicationInfoDto)),
 AutoMapTo(typeof(ApplicationInfoDto))]
public class ApplicationInfoPersistanceModel
{
    public string Version { get; set; }

    public DateTime ReleaseDate { get; set; }

    public bool IsQrLoginEnabled { get; set; }
}