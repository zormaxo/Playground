using System.Collections.Generic;
using System.Threading.Tasks;
using Analision.Authorization.Users.Dto;
using Analision.Dto;

namespace Analision.Authorization.Users.Exporting;

public interface IUserListExcelExporter
{
    Task<FileDto> ExportToFile(List<UserListDto> userListDtos, List<string> selectedColumns);
}