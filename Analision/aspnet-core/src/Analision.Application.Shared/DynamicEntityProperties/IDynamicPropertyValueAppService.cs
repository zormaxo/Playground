using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Analision.DynamicEntityProperties.Dto;

namespace Analision.DynamicEntityProperties;

public interface IDynamicPropertyValueAppService
{
    Task<DynamicPropertyValueDto> Get(int id);

    Task<ListResultDto<DynamicPropertyValueDto>> GetAllValuesOfDynamicProperty(EntityDto input);

    Task Add(DynamicPropertyValueDto dto);

    Task Update(DynamicPropertyValueDto dto);

    Task Delete(int id);
}

