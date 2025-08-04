using System.Collections.Generic;

namespace Analision.Authorization.Users.Profile.Dto;

public class UpdateGoogleAuthenticatorKeyOutput
{
    public IEnumerable<string> RecoveryCodes { get; set; }
}

