using System.Collections.Generic;
using Analision.Authorization.Permissions.Dto;

namespace Analision.Authorization.Users.Dto;

public class GetUserPermissionsForEditOutput
{
    public List<FlatPermissionDto> Permissions { get; set; }

    public List<string> GrantedPermissionNames { get; set; }
}

