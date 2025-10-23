using ShampanTailor.Models;
using ShampanTailor.Repo.Configuration;
using System;
using static ShampanTailor.Models.CommonModel;

namespace ShampanTailor.Repo
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
