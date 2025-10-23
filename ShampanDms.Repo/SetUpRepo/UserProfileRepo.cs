using Newtonsoft.Json;
using ShampanTailor.Models;
using ShampanTailor.Models.KendoCommon;
using ShampanTailor.Repo.Configuration;
using System;
using static ShampanTailor.Models.CommonModel;

namespace ShampanTailor.Repo
{
    public class UserProfileRepo
    {        
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/UserProfile/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserProfile/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(UserProfileVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserLogin/CreateEditAsync", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM PasswordUpdate(UserProfileVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserLogin/CreateEditAsync", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(UserProfileVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserLogin/CreateEditAsync", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserProfile/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/UserProfile/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}
