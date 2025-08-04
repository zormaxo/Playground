using Abp;
using System.Threading.Tasks;

namespace Analision.Authorization.Users.DataCleaners;

public interface IUserDataCleaner
{
    Task CleanUserData(UserIdentifier userIdentifier);
}

