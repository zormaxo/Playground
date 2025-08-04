using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Analision.EntityChanges.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Analision.EntityChanges;

public interface IEntityChangeAppService : IApplicationService
{
    Task<ListResultDto<EntityAndPropertyChangeListDto>> GetEntityChangesByEntity(GetEntityChangesByEntityInput input);
}

