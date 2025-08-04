using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Analision.Dto;

namespace Analision.DataImporting.Excel;

public interface IExcelInvalidEntityExporter<TEntityDto> : ITransientDependency
{
    Task<FileDto> ExportToFile(List<TEntityDto> entities);
}