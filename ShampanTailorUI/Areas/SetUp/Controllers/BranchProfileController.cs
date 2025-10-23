﻿using Newtonsoft.Json;
using ShampanTailor.Models;
using ShampanTailor.Models.KendoCommon;
using ShampanTailor.Repo;
using ShampanTailor.Repo.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ShampanTailorUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class BranchProfileController : Controller
    {
        BranchProfileRepo _repo = new BranchProfileRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: SetUp/BranchProfile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            BranchProfileVM vm = new BranchProfileVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }        

        [HttpPost]
        public ActionResult CreateEdit(BranchProfileVM model)
        {
            ResultModel<BranchProfileVM> result = new ResultModel<BranchProfileVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BranchProfileRepo();

            if (ModelState.IsValid)
            {
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
                            model = JsonConvert.DeserializeObject<BranchProfileVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<BranchProfileVM>()
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

                            result = new ResultModel<BranchProfileVM>()
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
                            result = new ResultModel<BranchProfileVM>()
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

                            result = new ResultModel<BranchProfileVM>()
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
            else
            {
                string msg = string.Empty;
                foreach (var entry in ModelState.Values)
                {
                    if (entry.Errors.Count > 0)
                    {
                        foreach (var error in entry.Errors)
                        {
                            msg += "," + error.ErrorMessage;
                        }
                    }
                }

                result = new ResultModel<BranchProfileVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = msg + " Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new BranchProfileRepo();

                BranchProfileVM vm = new BranchProfileVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "single";
                vm.TableName = "BranchProfiles";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "BranchProfile", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "BranchProfile", new { area = "DMS", id = id });
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

        [HttpPost]
        public ActionResult Delete(BranchProfileVM vm)
        {
            ResultModel<BranchProfileVM> result = new ResultModel<BranchProfileVM>();

            try
            {
                _repo = new BranchProfileRepo();
                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<BranchProfileVM>()
                {
                    Success = true,
                    Status = Status.Success,
                    Message = resultData.Message,
                    Data = null
                };

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BranchProfileRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BranchProfileVM>>(result.DataVM.ToString());

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new BranchProfileRepo();
                param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
                var resultStream = _repo.ReportPreview(param);

                if (resultStream == null)
                {
                    throw new Exception("Failed to generate report: No data received.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await resultStream.CopyToAsync(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();

                    if (fileBytes.Length < 1000)
                    {
                        string errorContent = Encoding.UTF8.GetString(fileBytes);
                        throw new Exception("Failed to generate report!");
                    }

                    Response.Headers.Add("Content-Disposition", "inline; filename=BranchProfile_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "BranchProfile", new { area = "DMS", message = TempData["Message"] });
            }
        }


    }
}