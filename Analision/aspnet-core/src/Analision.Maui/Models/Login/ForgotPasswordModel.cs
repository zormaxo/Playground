using System.ComponentModel.DataAnnotations;

namespace Analision.Maui.Models.Login;

public class ForgotPasswordModel
{
    [EmailAddress]
    [Required]
    public string EmailAddress { get; set; }
}