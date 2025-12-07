using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.Exam;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanExam.Models.CommonModel;

namespace ShampanExam.Repo.Exam
{
    public class ExamRepo
    {
        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exams/QuestionAnsList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(List<QuestionVM> Answers)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exam/Insert", authModel, JsonConvert.SerializeObject(Answers));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM ExamSubmit(QuestionVM Answers)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Exams/ExamSubmit", authModel, JsonConvert.SerializeObject(Answers));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Examinee/GetExameelistGridData", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

}
