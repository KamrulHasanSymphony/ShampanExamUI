using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using ShampanTailor.Models;
using ShampanTailorUI.Persistence;
using System;
using static ShampanTailorUI.App_Start.IdentityConfig;
[assembly: OwinStartup(typeof(ShampanTailorUI.Startup))]

namespace ShampanTailorUI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }

        public void ConfigureAuth(IAppBuilder app)
        {
            // Register OWIN contexts for Identity
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Configure cookie authentication
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Login/Index"),
                ExpireTimeSpan = TimeSpan.FromMinutes(30),
                SlidingExpiration = true,
                Provider = new CookieAuthenticationProvider
                {
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                    validateInterval: TimeSpan.FromMinutes(30),
                    regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                        }
                });


        }

    }


}