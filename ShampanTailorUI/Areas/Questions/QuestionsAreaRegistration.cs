using System.Web.Mvc;

namespace ShampanTailorUI.Areas.Questions
{
    public class ExamAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Questions";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Questions_default",
                "Questions/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}