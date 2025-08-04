using System.Text.RegularExpressions;

namespace Analision.Web.Xss;


public class DefaultHtmlSanitizer : IHtmlSanitizer
{
    public string Sanitize(string html)
    {
        return Regex.Replace(html, "<.*?>|&.*?;", string.Empty);
    }
}

