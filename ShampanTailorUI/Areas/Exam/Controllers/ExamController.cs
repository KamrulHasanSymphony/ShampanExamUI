using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.Exam;
using ShampanExam.Repo;
using ShampanExam.Repo.Exam;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanExamUI.Areas.Exam.Controllers
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