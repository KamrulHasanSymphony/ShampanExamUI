using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.Helper;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo;
using ShampanExam.Repo.QuestionRepo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace ShampanExamUI.Areas.Questions.Controllers
{
    [Authorize]
    [RouteArea("Questions")]
    public class QuestionSetsController : Controller
    {
        QuestionSetsRepo _repo = new QuestionSetsRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: Exam/QuestionSet
        public ActionResult Index()
        {
            QuestionSetHeaderVM vm = new QuestionSetHeaderVM();

            #region companyId & BranchId Set
            var companyId = Session["CompanyId"];
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = currentBranchId;
            //vm.CompanyId = companyId.ToString();
            #endregion

            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);

            vm.PeramModel.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.PeramModel.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            return View(vm);
        }

        public ActionResult Create()
        {
            QuestionSetHeaderVM vm = new QuestionSetHeaderVM();
            vm.Operation = "add";

            #region companyId & BranchId Set
            var companyId = Session["CompanyId"];
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = currentBranchId;
            //vm.CompanyId = companyId.ToString();
            #endregion

            return View("Create", vm);
        }


        [HttpPost]
        public ActionResult CreateEdit(QuestionSetHeaderVM model)
        {
            ResultModel<QuestionSetHeaderVM> result = new ResultModel<QuestionSetHeaderVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new QuestionSetsRepo();

            //if (ModelState.IsValid)
            //{
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<QuestionSetHeaderVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<QuestionSetHeaderVM>()
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

                            result = new ResultModel<QuestionSetHeaderVM>()
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

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<QuestionSetHeaderVM>()
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

                            result = new ResultModel<QuestionSetHeaderVM>()
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
            //}
            //else
            //{
            //    result = new ResultModel<QuestionSetHeaderVM>()
            //    {
            //        Success = false,
            //        Status = Status.Fail,
            //        Message = "Model State Error!",
            //        Data = model
            //    };
            //    return Json(result);
            //}
        }

        //[HttpPost]
        //public ActionResult CreateEdit(QuestionSetHeaderVM model)
        //{
        //    ResultModel<QuestionSetHeaderVM> result = new ResultModel<QuestionSetHeaderVM>();
        //    ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error" };
        //    _repo = new QuestionSetsRepo();

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            if (model.Operation.ToLower() == "add")
        //            {
        //                model.CreatedBy = Session["UserId"].ToString();
        //                model.CreatedOn = DateTime.Now.ToString();
        //                model.CreatedFrom = Ordinary.GetLocalIpAddress();

        //                resultVM = _repo.Insert(model);

        //                if (resultVM.Status == ResultStatus.Success.ToString())
        //                {
        //                    model = JsonConvert.DeserializeObject<QuestionSetHeaderVM>(resultVM.DataVM.ToString());
        //                    model.Operation = "add";
        //                    Session["result"] = resultVM.Status + "~" + resultVM.Message;

        //                    result = new ResultModel<QuestionSetHeaderVM>()
        //                    {
        //                        Success = true,
        //                        Status = Status.Success,
        //                        Message = resultVM.Message,
        //                        Data = model
        //                    };
        //                    return Json(result);
        //                }
        //                else
        //                {
        //                    Session["result"] = "Fail" + "~" + resultVM.Message;

        //                    result = new ResultModel<QuestionSetHeaderVM>()
        //                    {
        //                        Status = Status.Fail,
        //                        Message = resultVM.Message,
        //                        Data = model
        //                    };
        //                    return Json(result);
        //                }
        //            }
        //            else if (model.Operation.ToLower() == "update")
        //            {
        //                model.LastUpdateBy = Session["UserId"].ToString();
        //                //model.LastUpdateOn = DateTime.Now.ToString();
        //                model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

        //                resultVM = _repo.Update(model);

        //                if (resultVM.Status == ResultStatus.Success.ToString())
        //                {
        //                    Session["result"] = resultVM.Status + "~" + resultVM.Message;
        //                    result = new ResultModel<QuestionSetHeaderVM>()
        //                    {
        //                        Success = true,
        //                        Status = Status.Success,
        //                        Message = resultVM.Message,
        //                        Data = model
        //                    };
        //                    return Json(result);
        //                }
        //                else
        //                {
        //                    Session["result"] = "Fail" + "~" + resultVM.Message;
        //                    result = new ResultModel<QuestionSetHeaderVM>()
        //                    {
        //                        Status = Status.Fail,
        //                        Message = resultVM.Message,
        //                        Data = model
        //                    };
        //                    return Json(result);
        //                }
        //            }
        //            else
        //            {
        //                return RedirectToAction("Index");
        //            }
        //        }
        //        catch (Exception e)
        //        {
        //            Session["result"] = "Fail" + "~" + e.Message;
        //            Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //            return View("Create", model);
        //        }
        //    }
        //    else
        //    {
        //        result = new ResultModel<QuestionSetHeaderVM>()
        //        {
        //            Success = false,
        //            Status = Status.Fail,
        //            Message = "Model State Error!",
        //            Data = model
        //        };
        //        return Json(result);
        //    }
        //}

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new QuestionSetsRepo();
                QuestionSetHeaderVM vm = new QuestionSetHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<QuestionSetHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        [HttpGet]
        public ActionResult GetQuestionSetData(string id)
        {
            try
            {
                _repo = new QuestionSetsRepo();

                QuestionSetHeaderVM vm = new QuestionSetHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<QuestionSetHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";
                return Json(vm, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpGet]
        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM
                {
                    Id = id.ToString(),
                    Status = status,
                    Type = "transactional",
                    TableName = "QuestionSetHeaders"
                };

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "QuestionSet", new { area = "Exam", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "QuestionSet", new { area = "Exam", id = id });
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

        //[HttpPost]
        //public JsonResult GetGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        //{
        //    ResultVM result = new ResultVM { Status = "Fail", Message = "Error" };
        //    _repo = new QuestionSetsRepo();

        //    try
        //    {
        //        options.vm.BranchId = branchId == "0" ? "" : branchId;
        //        options.vm.IsPost = isPost;
        //        options.vm.FromDate = fromDate;
        //        options.vm.ToDate = toDate;
        //        options.vm.CompanyId = Session["CompanyId"]?.ToString();

        //        result = _repo.GetGridData(options);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionSetHeaderVM>>(result.DataVM.ToString());
        //            return Json(new
        //            {
        //                Items = gridData.Items,
        //                TotalCount = gridData.TotalCount
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public ActionResult MultiplePost(CommonVM vm)
        {
            ResultModel<QuestionSetHeaderVM> result = new ResultModel<QuestionSetHeaderVM>();
            _repo = new QuestionSetsRepo();

            try
            {
                vm.ModifyBy = Session["UserId"].ToString();
                vm.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(vm);
                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<QuestionSetHeaderVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<QuestionSetHeaderVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new QuestionSetsRepo();
                param.CompanyId = Session["CompanyId"]?.ToString();
                var resultStream = _repo.ReportPreview(param);

                if (resultStream == null)
                    throw new Exception("Failed to generate report: No data received.");

                using (var memoryStream = new MemoryStream())
                {
                    await resultStream.CopyToAsync(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();

                    if (fileBytes.Length < 1000)
                    {
                        string errorContent = Encoding.UTF8.GetString(fileBytes);
                        throw new Exception("Failed to generate report!");
                    }

                    Response.Headers.Add("Content-Disposition", "inline; filename=QuestionSet_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message;
                return RedirectToAction("Index", "QuestionSet", new { area = "Exam", message = TempData["Message"] });
            }
        }

        [HttpGet]
        public JsonResult GetQuestionSetDetailDataById(GridOptions options, int headerId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error" };
            _repo = new QuestionSetsRepo();

            try
            {
                result = _repo.GetQuestionSetDetailDataById(options, headerId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionSetDetailVM>>(result.DataVM.ToString());
                    return Json(new { Items = gridData.Items, TotalCount = gridData.TotalCount }, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetQuestionSetGridDataByQuestion(GridOptions options, string questionHeaderId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error" };
            _repo = new QuestionSetsRepo();

            try
            {
                result = _repo.GetQuestionSetGridDataByQuestion(options, questionHeaderId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionSetHeaderVM>>(result.DataVM.ToString());
                    return Json(new { Items = gridData.Items, TotalCount = gridData.TotalCount }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult DetailsIndex()
        {
            QuestionSetDetailVM vm = new QuestionSetDetailVM();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);

            vm.PeramModel.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.PeramModel.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            return View(vm);
        }

        // POST: Questions/QuestionSets/GetGridData
        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new QuestionSetsRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionSetHeaderVM>>(result.DataVM.ToString());

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
        public JsonResult GetDetailsGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error" };
            _repo = new QuestionSetsRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;

                result = _repo.GetQuestionSetDetailDataById(options, 0); // 0 = all sets or modify if masterId needed

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<QuestionSetDetailVM>>(result.DataVM.ToString());
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
