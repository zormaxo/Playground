using System.ComponentModel.DataAnnotations;

namespace Analision.Authorization.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}

