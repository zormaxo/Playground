using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.BackgroundJobs;
using Analision.Authorization;
using Analision.Authorization.Users.Importing;
using Analision.DataImporting.Excel;
using Analision.Storage;
using Analision.Storage.FileValidator;

namespace Analision.Web.Controllers;

[AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
public class UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager, IFileValidatorManager fileValidatorManager)
    : ExcelImportControllerBase(binaryObjectManager, backgroundJobManager, fileValidatorManager)
{
    public override string ImportExcelPermission => AppPermissions.Pages_Administration_Users_Create;

    public override async Task EnqueueExcelImportJobAsync(ImportFromExcelJobArgs args)
    {
        await BackgroundJobManager.EnqueueAsync<ImportUsersToExcelJob, ImportFromExcelJobArgs>(args);
    }
}