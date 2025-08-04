using Abp.Auditing;
using System.ComponentModel.DataAnnotations;

namespace Analision.Authorization.Accounts.Dto;

public class SendEmailActivationLinkInput
{
    [Required]
    public string EmailAddress { get; set; }

    [DisableAuditing]
    public string CaptchaResponse { get; set; }
}

