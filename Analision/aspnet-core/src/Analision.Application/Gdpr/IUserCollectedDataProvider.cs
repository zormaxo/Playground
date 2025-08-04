using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Analision.Dto;

namespace Analision.Gdpr;

public interface IUserCollectedDataProvider
{
    Task<List<FileDto>> GetFiles(UserIdentifier user);
}
