using Microsoft.Extensions.Configuration;

namespace Analision.Configuration;

public interface IAppConfigurationAccessor
{
    IConfigurationRoot Configuration { get; }
}

