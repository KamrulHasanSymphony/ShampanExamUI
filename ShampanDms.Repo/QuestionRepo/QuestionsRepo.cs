using Newtonsoft.Json;
using ShampanTailor.Models;
using ShampanTailor.Models.KendoCommon;
using ShampanTailor.Models.QuestionVM;
using ShampanTailor.Repo.Configuration;
using System;
using static ShampanTailor.Models.CommonModel;

namespace ShampanTailor.Repo.QuestionRepo
{
    public class QuestionsRepo
    {
        // Insert Method for QuestionHeader
        public ResultVM Insert(QuestionHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/QuestionHeader/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Update Method for QuestionHeader
        public ResultVM Update(QuestionHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/QuestionHeader/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // List Method for QuestionHeader
        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/QuestionHeader/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        // GetGridData Method for QuestionHeader
        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/QuestionHeader/GetGridData", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Delete Method for QuestionHeader (if needed)
        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/QuestionHeader/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //// Insert Method for QuestionOptionDetail
        //public ResultVM InsertOption(QuestionOptionDetailVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/QuestionOption/Insert", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        //// Update Method for QuestionOptionDetail
        //public ResultVM UpdateOption(QuestionOptionDetailVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/QuestionOption/Update", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        //// Insert Method for QuestionShortDetail
        //public ResultVM InsertShort(QuestionShortDetailVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/QuestionShort/Insert", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        //// Update Method for QuestionShortDetail
        //public ResultVM UpdateShort(QuestionShortDetailVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/QuestionShort/Update", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
    }
}
