﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Analision.Sessions.Dto;

namespace Analision.Maui.Models.Common;

[AutoMapFrom(typeof(UserLoginInfoDto)),
 AutoMapTo(typeof(UserLoginInfoDto))]
public class UserLoginInfoPersistanceModel : EntityDto<long>
{
    public string Name { get; set; }

    public string Surname { get; set; }

    public string UserName { get; set; }

    public string EmailAddress { get; set; }

    public string ProfilePictureId { get; set; }
}