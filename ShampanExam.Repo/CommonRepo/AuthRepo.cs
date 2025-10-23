using ShampanExam.Models;
using ShampanExam.Repo.Configuration;
using System;
using static ShampanExam.Models.CommonModel;

namespace ShampanExam.Repo
{
    public class AuthRepo
    {
        public AuthModel SignInAuthentication(LoginResource model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                var result = httpRequestHelper.GetLoginAuthentication(new CredentialModel { UserName = model.UserName, Password = model.Password });                             

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}
