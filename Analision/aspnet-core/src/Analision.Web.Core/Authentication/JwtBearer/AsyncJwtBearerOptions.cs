using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Analision.Web.Authentication.JwtBearer;

public class AsyncJwtBearerOptions : JwtBearerOptions
{
    public readonly List<IAsyncSecurityTokenValidator> AsyncSecurityTokenValidators;

    private readonly AnalisionAsyncJwtSecurityTokenHandler _defaultAsyncHandler = new AnalisionAsyncJwtSecurityTokenHandler();

    public AsyncJwtBearerOptions()
    {
        AsyncSecurityTokenValidators = new List<IAsyncSecurityTokenValidator>() { _defaultAsyncHandler };
    }
}


