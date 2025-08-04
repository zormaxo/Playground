using System.Threading.Tasks;
using Analision.Sessions.Dto;

namespace Analision.Web.Session;

public interface IPerRequestSessionCache
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
}

