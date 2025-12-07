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
           

            return View();
        }

        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _examRepo = new ExamRepo();

            try
            {

                CommonVM param = new CommonVM();
                List<QuestionVM> vms = new List<QuestionVM>();
                param.Name = Session["UserId"].ToString();

                ExamineeRepo _examineeRepo = new ExamineeRepo();

                ResultVM res = _examineeRepo.List(param);

                if (res.Status == "Success" && res.DataVM != null)
                {
                    var examee = JsonConvert.DeserializeObject<List<ShampanExam.Models.QuestionVM.ExamineeVM>>(res.DataVM.ToString());
                    options.vm.Id = examee.FirstOrDefault().Id.ToString();
                }
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
            _examRepo = new ExamRepo();
            ResultModel<QuestionVM> res = new ResultModel<QuestionVM>();


            try
            {
               
                if(actionType == "Draft")
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

        public ActionResult Edit(string id)
        {
            try
            {
                CommonVM param = new CommonVM();
                List<QuestionVM> vms = new List<QuestionVM>();
               
                    param.Id = id;
                ResultVM result = _examRepo.List(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vms = JsonConvert.DeserializeObject<List<QuestionVM>>(result.DataVM.ToString());
                    if (vms != null && vms.Count > 0)
                    {
                        ShampanExam.Repo.QuestionRepo.ExamRepo _repo = new ShampanExam.Repo.QuestionRepo.ExamRepo();

                        CommonVM paramm = new CommonVM();
                        paramm.Id = vms.FirstOrDefault().ExamId.ToString();
                        ResultVM resultt = _repo.List(paramm);
                        ShampanExam.Models.QuestionVM.ExamVM vm = new ShampanExam.Models.QuestionVM.ExamVM();

                        if (resultt.Status == "Success" && resultt.DataVM != null)
                        {
                            vm = JsonConvert.DeserializeObject<List<ShampanExam.Models.QuestionVM.ExamVM>>(resultt.DataVM.ToString()).FirstOrDefault();
                        }
                        int i = 0;
                        foreach (var q in vms)
                        {
                            if (i == 0)
                            {
                                // 1. Date check
                                if (vm.Date != DateTime.Now.ToString("yyyy-MM-dd"))
                                {
                                    q.IsExamover = true;
                                    q.RemainingSeconds = 0;
                                }
                                else
                                {
                                    // Build full DateTime from Date + Time
                                    DateTime examDate = DateTime.Parse(vm.Date);      // yyyy-MM-dd
                                    TimeSpan examTime = vm.Time.Value;                    // TimeSpan HH:mm:ss

                                    DateTime examStart = examDate.Add(examTime);      // Full start datetime
                                    DateTime examEnd = examStart.AddMinutes(vm.Duration);

                                    // 2. Time check
                                    if (DateTime.Now >= examEnd)
                                    {
                                        q.IsExamover = true;
                                        q.RemainingSeconds = 0;
                                    }
                                    else
                                    {
                                        q.IsExamover = false;
                                        q.RemainingSeconds = (int)(examEnd - DateTime.Now).TotalSeconds;
                                    }
                                }
                            }
                            i++;

                        }
                    }
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

        public ActionResult Result(string id)
        {
            try
            {
                CommonVM param = new CommonVM();
                List<QuestionVM> vms = new List<QuestionVM>();
                ExaminerRepo _examRepo = new ExaminerRepo();

                param.Id = id;
                ResultVM result = _examRepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vms = JsonConvert.DeserializeObject<List<QuestionVM>>(result.DataVM.ToString());
                }
                else
                {
                    vms = null;
                }



                return View("Result", vms);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }
    }
}