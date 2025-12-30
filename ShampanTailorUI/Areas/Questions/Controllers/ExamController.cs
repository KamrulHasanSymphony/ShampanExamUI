using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.Exam;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo;
using ShampanExam.Repo.Helper;
using ShampanExam.Repo.QuestionRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ExamVM = ShampanExam.Models.QuestionVM.ExamVM;

namespace ShampanExamUI.Areas.Questions.Controllers
{
    [Authorize]
    [RouteArea("Questions")]
    public class ExamController : Controller
    {
        ExamRepo _repo = new ExamRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: Questions/Exam
        public ActionResult Index()
        {
            return View();
        }

        // GET: Questions/Exam/Create
        public ActionResult Create()
        {
            ExamVM vm = new ExamVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(ExamVM model)
        {
            ResultModel<ExamVM> result = new ResultModel<ExamVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ExamRepo();

            
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();
                    //model.BranchId = Session["BranchId"].ToString();

                    resultVM = _repo.Insert(model);

                        if (resultVM.Status == "Success")
                        {
                            model = JsonConvert.DeserializeObject<ExamVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<ExamVM>()
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

                            result = new ResultModel<ExamVM>()
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
                            result = new ResultModel<ExamVM>()
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

                            result = new ResultModel<ExamVM>()
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

        // GET: Questions/Exam/Edit
        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new ExamRepo();

                ExamVM vm = new ExamVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ExamVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult getReport(string id)
        {
            try
            {
                _repo = new ExamRepo();

                ExamReportHeaderVM vm = new ExamReportHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.GetExamInfoReport(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ExamReportHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }


                return View("ExamInfoReport", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        public ActionResult ExamInfoReport()
        {
            ExamVM vm = new ExamVM();
            vm.Operation = "add";

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

            #region DecimalPlace (optional, adapt if needed)
            CommonVM commonVM = new CommonVM();
            commonVM.Group = "SaleDecimalPlace";
            commonVM.Name = "SaleDecimalPlace";
            var settingsValue = _commonRepo.GetSettingsValue(commonVM);

            if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
            {
                var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();
            }
            #endregion

            return View("ExamInfoReport", vm);
        }


        // GET: Questions/Exam/GetProcessedData
        [HttpGet]
        public ActionResult GetProcessedData(string id,string groupId, string setId)
        {
            try
            {
                _repo = new ExamRepo();
                CommonVM param = new CommonVM { Id = id, Group=groupId,Value=setId};

                ResultVM result = _repo.GetProcessedData(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    return Json(new
                    {
                        success = true,
                        message = result.Message,
                        data = result.DataVM 
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, message = result.Message }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Questions/Exam/GetGridData
        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ExamRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ExamVM>>(result.DataVM.ToString());

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

        //// POST: Questions/Exam/ReportPreview
        //[HttpPost]
        //public async Task<ActionResult> ReportPreview(CommonVM param)
        //{
        //    try
        //    {
        //        _repo = new ExamRepo();
        //        param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
        //        var resultStream = _repo.ReportPreview(param);

        //        if (resultStream == null)
        //        {
        //            throw new Exception("Failed to generate report: No data received.");
        //        }

        //        using (var memoryStream = new MemoryStream())
        //        {
        //            await resultStream.CopyToAsync(memoryStream);
        //            byte[] fileBytes = memoryStream.ToArray();

        //            if (fileBytes.Length < 1000)
        //            {
        //                string errorContent = Encoding.UTF8.GetString(fileBytes);
        //                throw new Exception("Failed to generate report!");
        //            }

        //            Response.Headers.Add("Content-Disposition", "inline; filename=Exam_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

        //            return File(fileBytes, "application/pdf");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        TempData["Message"] = e.Message.ToString();
        //        return RedirectToAction("Index", "Exam", new { area = "Exam", message = TempData["Message"] });
        //    }
        //}
    }
}
