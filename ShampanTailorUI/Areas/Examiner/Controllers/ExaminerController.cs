using DocumentFormat.OpenXml.EMMA;
using Newtonsoft.Json;
using Org.BouncyCastle.Pqc.Crypto.Lms;
using ShampanExam.Models;
using ShampanExam.Models.Exam;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo;
using ShampanExam.Repo.Exam;
using ShampanExam.Repo.ExamineeRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanExamUI.Areas.Examiner.Controllers
{
    [Authorize]
    [RouteArea("Examiner")]
    public class ExaminerController : Controller
    {
        // GET: Exam/Exam
        ExaminerRepo _examRepo = new ExaminerRepo();
        CommonRepo _commonRepo = new CommonRepo();


        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SelfIndex()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _examRepo = new ExaminerRepo();

            try
            {

                //CommonVM param = new CommonVM();
                //List<QuestionVM> vms = new List<QuestionVM>();
                //param.Name = Session["UserId"].ToString();

                //ExamineeRepo _examineeRepo = new ExamineeRepo();

                //ResultVM res = _examineeRepo.List(param);

                //if (res.Status == "Success" && res.DataVM != null)
                //{
                //    var examee = JsonConvert.DeserializeObject<List<ShampanExam.Models.QuestionVM.ExamineeVM>>(res.DataVM.ToString());
                //    options.vm.Id = examee.FirstOrDefault().Id.ToString();
                //}
                result = _examRepo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ShampanExam.Models.QuestionVM.ExamVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult CreateEdit(List<QuestionVM> Answers, string actionType)
        {
            ResultModel<ShampanExam.Models.Exam.ExamVM> result = new ResultModel<ShampanExam.Models.Exam.ExamVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _examRepo = new ExaminerRepo();
            ResultModel<QuestionVM> res = new ResultModel<QuestionVM>();


            try
            {

                if (actionType == "Draft")
                {
                    resultVM = _examRepo.Insert(Answers);

                }
                else
                {
                    resultVM = _examRepo.Insert(Answers);

                    resultVM = _examRepo.ExamSubmit(Answers.FirstOrDefault());
                }

                if (resultVM.Status == "Success")
                {

                    res = new ResultModel<QuestionVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = null
                    };
                    return Json(res);

                }
                else
                {
                    res = new ResultModel<QuestionVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                    return Json(res);

                }

            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", Answers);
            }


        }

        public ActionResult Edit(string id, string examId)
        {
            try
            {
                CommonVM param = new CommonVM();
                List<QuestionVM> vms = new List<QuestionVM>();

                param.Id = id;
                param.ExamId = examId;
                ResultVM result = _examRepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vms = JsonConvert.DeserializeObject<List<QuestionVM>>(result.DataVM.ToString());
                }
                else
                {
                    vms = null;
                }



                return View("Create", vms);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public JsonResult SelfGetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _examRepo = new ExaminerRepo();

            try
            {

                CommonVM param = new CommonVM();
                List<QuestionVM> vms = new List<QuestionVM>();
                param.Name = Session["UserId"].ToString();

                ExamineeRepo _examineeRepo = new ExamineeRepo();

                ResultVM res = _examineeRepo.List(param);

                if (res != null && res.Status == "Success" && res.DataVM != null)
                {
                    var examee = JsonConvert.DeserializeObject<List<ExamineeVM>>(res.DataVM.ToString());

                    var firstExamee = examee?.FirstOrDefault();
                    if (firstExamee != null && options?.vm != null)
                    {
                        options.vm.Id = firstExamee.Id.ToString();
                    }
                }
                else
                {
                    return Json(new { Error = true, Message = "Examinee data not found." });
                }
                result = _examRepo.SelfGetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ShampanExam.Models.QuestionVM.ExamVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}