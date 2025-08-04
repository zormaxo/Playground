using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Analision.Authorization.Users.Importing.Dto;
using Analision.DataExporting.Excel.MiniExcel;
using Analision.DataImporting.Excel;
using Analision.Dto;
using Analision.Storage;

namespace Analision.Authorization.Users.Importing;

public class InvalidUserExporter(ITempFileCacheManager tempFileCacheManager)
    : MiniExcelExcelExporterBase(tempFileCacheManager), IExcelInvalidEntityExporter<ImportUserDto>
{
    public async Task<FileDto> ExportToFile(List<ImportUserDto> userList)
    {
        var items = new List<Dictionary<string, object>>();

        foreach (var user in userList)
        {
            items.Add(new Dictionary<string, object>()
            {
                {L("UserName"), user.UserName},
                {L("Name"), user.Name},
                {L("Surname"), user.Surname},
                {L("EmailAddress"), user.EmailAddress},
                {L("PhoneNumber"), user.PhoneNumber},
                {L("Password"), user.Password},
                {L("Roles"), user.Roles?.JoinAsString(",")},
                {L("RefuseReason"), user.Exception}
            });
        }

        return await CreateExcelPackageAsync("InvalidUserImportList.xlsx", items);
    }
}