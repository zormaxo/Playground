using Microsoft.AspNetCore.Mvc;
using Analision.Web.Controllers;

namespace Analision.Web.Public.Controllers;

public class HomeController : AnalisionControllerBase
{
    public ActionResult Index()
    {
        return View();
    }
}

