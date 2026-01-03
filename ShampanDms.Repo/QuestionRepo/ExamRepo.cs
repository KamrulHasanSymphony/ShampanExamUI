using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo.Configuration;
using System;
using System.IO;
using System.Reflection;
using static ShampanExam.Models.CommonModel;

namespace ShampanExam.Repo.QuestionRepo
{
    public class ExamRepo
    {
        // Insert Method
        public ResultVM Insert(ExamVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Update Method
        public ResultVM Update(ExamVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Delete Method
        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // List Method
        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM GetExamInfoReport(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/ExamInfoReport", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }



        public ResultVM GetProcessedData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                var data = httpRequestHelper.PostData("api/Exam/GetProcessedData", authModel, JsonConvert.SerializeObject(model));

                // Deserialize the first-level ResultVM
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                // ✅ Step 2: Deserialize the nested DataVM into ExamVM
                if (result != null && result.Status == "Success" && result.DataVM != null)
                {
                    var examVm = JsonConvert.DeserializeObject<ExamVM>(result.DataVM.ToString());
                    result.DataVM = examVm; 
                }

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //// ListAsDataTable Method
        //public ResultVM ListAsDataTable(string[] conditionalFields, string[] conditionalValues, PeramModel vm = null)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.GetData("api/Exam/ListAsDataTable", authModel);
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        //// Dropdown Method
        //public ResultVM Dropdown()
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.GetData("api/Exam/Dropdown", authModel);
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        // GetGridData Method
        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/GetGridData", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetRandomProcessedData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                var data = httpRequestHelper.PostData("api/Exam/GetRandomProcessedData", authModel, JsonConvert.SerializeObject(model));

                // Deserialize the first-level ResultVM
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                // ✅ Step 2: Deserialize the nested DataVM into ExamVM
                if (result != null && result.Status == "Success" && result.DataVM != null)
                {
                    var examVm = JsonConvert.DeserializeObject<ExamVM>(result.DataVM.ToString());
                    result.DataVM = examVm;
                }

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //// ReportPreview Method
        //public Stream ReportPreview(CommonVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
        //        var result = httpRequestHelper.PostDataReport("api/Exam/ReportPreview", authModel, JsonConvert.SerializeObject(model));

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}
    }
}
