﻿using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ShampanExam.Models;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo;
using ShampanExamUI.Persistence;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Web.Mvc;

namespace ShampanExamUI.Areas.Common.Controllers
{
    [Authorize]
    public class CommonController : Controller
    {
        CommonRepo _repo = new CommonRepo();
        UserBranchProfileRepo userBranchProfileRepo = new UserBranchProfileRepo();
        BranchProfileRepo _branchRepo = new BranchProfileRepo();

        // GET: Common/Common
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult SettingsValue(string value)
        {
            try
            {
                List<CommonVM> lst = new List<CommonVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSettingsValue(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CommonVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult _getProductModal()
        {
            return PartialView("_getProductModal");
        }

        [HttpGet]
        public ActionResult _getMeasurementModal()
        {
            return PartialView("_getMeasurementModal");
        }
        [HttpGet]
        public ActionResult _getMeasurementForOrderModal()
        {
            return PartialView("_getMeasurementForOrderModal");
        }
        [HttpGet]
        public ActionResult _getItemDesignModal()
        {
            return PartialView("_getItemDesignModal");
        }
        [HttpGet]
        public ActionResult _getViewMeasurementForOrderModal()
        {
            return PartialView("_getViewMeasurementForOrderModal");
        }

        [HttpGet]
        public ActionResult _getItemModal()
        {
            return PartialView("_getItemModal");
        }

        [HttpGet]
        public ActionResult _getDesignCategoryModal()
        {
            return PartialView("_getDesignCategoryModal");
        }
        [HttpGet]
        public ActionResult _getUomModal()
        {
            return PartialView("_getUomModal");
        }
        [HttpGet]
        public ActionResult _getFabricSourceModal()
        {
            return PartialView("_getFabricSourceModal");
        }
        [HttpGet]
        public ActionResult _getDesignTypeModal()
        {
            return PartialView("_getDesignTypeModal");
        }
        [HttpGet]
        public ActionResult _getDesignFollowedModal()
        {
            return PartialView("_getDesignFollowedModal");
        }

        [HttpPost]
        public ActionResult GetProductData()
        {
            try
            {
                _repo = new CommonRepo();

                ProductVM vm = new ProductVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                vm.ProductCode = search;
                vm.ProductName = search;
                vm.Status = search;

                ResultVM result = _repo.GetProductModalData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetBooleanDropDown()
        {
            _repo = new CommonRepo();
            try
            {
                var result = _repo.GetBooleanDropDown();
                return Json(result.Data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        //[HttpGet]
        //public ActionResult GetCustomerList(string value)
        //{
        //    try
        //    {
        //        List<CustomerVM> lst = new List<CustomerVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetCustomerList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetEnumTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetEnumTypeList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCompanyTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetBranchProfileList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetBranchList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                ResultVM result = new ResultVM();
                param.Value = value;
                param.UserId = Session["UserId"] != null ? Session["UserId"].ToString() : "";

                if (Session["UserId"] != null && Session["UserId"].ToString().ToLower() == "erp")
                {

                    param.UserId = Session["UserId"].ToString();
                    result = _branchRepo.List(param);
                }
                else
                {
                    userBranchProfileRepo = new UserBranchProfileRepo();
                    param.UserId = Session["UserId"].ToString();
                    result = userBranchProfileRepo.List(param);
                }

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }

                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult BranchLoading(string UserId)
        {
            UserBranchProfileVM model = new UserBranchProfileVM();
            model.Operation = "add";
            model.UserId = UserId;
            return PartialView("_branchLoading", model);
        }

        


        [HttpGet]
        public ActionResult GetQuestionDataForSet()
        {
            try
            {
                List<QuestionHeaderVM> lst = new List<QuestionHeaderVM>();
                CommonVM param = new CommonVM();

                ResultVM result = _repo.GetQuestionDataForSet(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<QuestionHeaderVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}