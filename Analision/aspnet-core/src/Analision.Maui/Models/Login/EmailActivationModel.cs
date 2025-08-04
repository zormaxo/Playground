using System.ComponentModel.DataAnnotations;

namespace Analision.Maui.Models.Login;

public class EmailActivationModel
{
    [Required]
    [EmailAddress]
    public string EmailAddress { get; set; }
}