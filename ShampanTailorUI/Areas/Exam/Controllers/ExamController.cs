using Newtonsoft.Json;
using ShampanTailor.Models;
using ShampanTailor.Models.Exam;
using ShampanTailor.Repo;
using ShampanTailor.Repo.Exam;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanTailorUI.Areas.Exam.Controllers
{
    [Authorize]
    [RouteArea("Exam")]
    public class ExamController : Controller
    {
        // GET: Exam/Exam
        ExamRepo _examRepo = new ExamRepo();
        CommonRepo _commonRepo = new CommonRepo();


        public ActionResult Index()
        {
            CommonVM param = new CommonVM();
            List<QuestionVM> vms = new List<QuestionVM>();

            ResultVM result = _examRepo.List(param);

            if (result.Status == "Success" && result.DataVM != null)
            {
                vms = JsonConvert.DeserializeObject<List<QuestionVM>>(result.DataVM.ToString());
            }
            else
            {
                vms = null;
            }

            return View("Index", vms);
        }
    }
}