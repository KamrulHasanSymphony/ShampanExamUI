using Newtonsoft.Json;
using ShampanTailor.Models;
using ShampanTailor.Models.Helper;
using ShampanTailor.Models.KendoCommon;
using ShampanTailor.Models.QuestionVM;
using ShampanTailor.Repo;
using ShampanTailor.Repo.QuestionRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanTailorUI.Areas.Questions.Controllers
{
    [Authorize]
    [RouteArea("Questions")]
    public class GradeController : Controller
    {
        GradeRepo _repo = new GradeRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: Questions/Grade
        public ActionResult Index()
        {
            return View();
        }

        // GET: Questions/Grade/Create
        public ActionResult Create()
        {
            GradeHeaderVM vm = new GradeHeaderVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }

        // POST: Questions/Grade/CreateEdit
        [HttpPost]
        public ActionResult CreateEdit(GradeHeaderVM model)
        {
            ResultModel<GradeHeaderVM> result = new ResultModel<GradeHeaderVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new GradeRepo();

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
                            model = JsonConvert.DeserializeObject<GradeHeaderVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<GradeHeaderVM>()
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

                            result = new ResultModel<GradeHeaderVM>()
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
                            result = new ResultModel<GradeHeaderVM>()
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

                            result = new ResultModel<GradeHeaderVM>()
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
            //    result = new ResultModel<GradeHeaderVM>()
            //    {
            //        Success = false,
            //        Status = Status.Fail,
            //        Message = "Model State Error!",
            //        Data = model
            //    };
            //    return Json(result);
            //}
        }

        // GET: Questions/Grade/Edit
        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new GradeRepo();

                GradeHeaderVM vm = new GradeHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<GradeHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        // POST: Questions/Grade/GetGridData
        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new GradeRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<GradeHeaderVM>>(result.DataVM.ToString());

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


        // POST: Questions/Grade/Dropdown
        [HttpGet]
        public ActionResult Dropdown(string value)
        {
            try
            {
                List<GradeHeaderVM> lst = new List<GradeHeaderVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.Dropdown(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<GradeHeaderVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        // GET: Questions/Grade/NextPrevious
        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "single";
                vm.TableName = "GradeHeaders";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Grade", new { area = "Questions", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Grade", new { area = "Questions", id = id });
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
