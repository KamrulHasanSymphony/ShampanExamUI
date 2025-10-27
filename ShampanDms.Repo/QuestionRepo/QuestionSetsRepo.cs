using Newtonsoft.Json;
using ShampanExam.Models;
using ShampanExam.Models.KendoCommon;
using ShampanExam.Models.QuestionVM;
using ShampanExam.Repo.Configuration;
using ShampanTailor.Models.QuestionVM;
using System;
using System.Collections.Generic;
using System.IO;
using static ShampanExam.Models.CommonModel;

namespace ShampanExam.Repo.QuestionRepo
{
    public class QuestionSetsRepo
    {
        public ResultVM Insert(QuestionSetHeaderVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/Insert", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM Update(QuestionSetHeaderVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/Update", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM MultipleDelete(CommonVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/Delete", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM List(CommonVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/List", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/GetGridData", auth,
                    JsonConvert.SerializeObject(options, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM Dropdown()
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/Dropdown", auth, JsonConvert.SerializeObject(auth));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                return http.PostDataReport("api/QuestionSets/ReportPreview", auth, JsonConvert.SerializeObject(model));
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/MultiplePost", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM GetQuestionSetDetailDataById(GridOptions options, int headerId)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData($"api/QuestionSets/GetQuestionSetDetailDataById?headerId={headerId}", auth,
                    JsonConvert.SerializeObject(options, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM GetQuestionSetGridDataByQuestion(GridOptions options, string questionHeaderId)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                options.vm.Id = questionHeaderId;

                var data = http.PostData("api/QuestionSets/GetQuestionSetGridDataByQuestion", auth,
                    JsonConvert.SerializeObject(options, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        // 🔹 Extra link-table calls (parallel to cattle detail in sample)
        public ResultVM InsertQuestionSetQuestion(QuestionSetQuestionVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/InsertQuestionSetQuestion", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }

        public ResultVM QuestionSetQuestionList(CommonVM model)
        {
            try
            {
                var http = new HttpRequestHelper();
                var auth = new AuthModel { token = ClaimNames.token };

                var data = http.PostData("api/QuestionSets/QuestionSetQuestionList", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(data);
            }
            catch (Exception e) { throw e; }
        }
    }
}
