using Abp.AutoMapper;
using Analision.Authorization.Users.Dto;

namespace Analision.Maui.Models.User;

[AutoMapFrom(typeof(UserListDto))]
public class UserListModel : UserListDto
{
    public string Photo { get; set; }

    public string FullName => Name + " " + Surname;
}