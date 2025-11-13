using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.Helper;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo;
using ShampanExam.Repo.QuestionRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanExamUI.Areas.Questions.Controllers
{
    [Authorize]
    [RouteArea("Questions")]
    public class QuestionController : Controller
    {
        QuestionsRepo _repo = new QuestionsRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: Questions/Question
        public ActionResult Index()
        {
            return View();
        }

        // GET: Questions/Question/Create
        public ActionResult Create()
        {
            QuestionHeaderVM vm = new QuestionHeaderVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }

        // POST: Questions/Question/CreateEdit
        [HttpPost]
        public ActionResult CreateEdit(QuestionHeaderVM model)
        {
            ResultModel<QuestionHeaderVM> result = new ResultModel<QuestionHeaderVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();


                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == "Success")
                    {
                        model = JsonConvert.DeserializeObject<QuestionHeaderVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<QuestionHeaderVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                    else
                    {
                        Session["result"] = "Fail" + "~" + resultVM.Message;

                        result = new ResultModel<QuestionHeaderVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                }
                else if (model.Operation.ToLower() == "update")
                {
                    model.LastModifiedBy = Session["UserId"].ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Update(model);

                    if (resultVM.Status == "Success")
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<QuestionHeaderVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                    else
                    {
                        Session["result"] = "Fail" + "~" + resultVM.Message;

                        result = new ResultModel<QuestionHeaderVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }
        }

        // GET: Questions/Question/Edit
        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new QuestionsRepo();

                QuestionHeaderVM vm = new QuestionHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<QuestionHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        // POST: Questions/Question/GetGridData
        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new QuestionsRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionHeaderVM>>(result.DataVM.ToString());

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

        // GET: Questions/Question/NextPrevious
        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "single";
                vm.TableName = "QuestionHeaders";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Question", new { area = "Questions", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Question", new { area = "Questions", id = id });
                    return Redirect(url);
                }
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
