using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class ExamineeVM : Audit
    {
        [Display(Name = "Examinee")]
        public long Id { get; set; }
        public long? ExamineeId { get; set; }
        [Required]

        [Display(Name = "Examinee Group")]
        public int? ExamineeGroupId { get; set; }
        [Required]
        [Display(Name = "Examinee Name")]
        public string? Name { get; set; }
        public string? GroupName { get; set; }


        [Required]

        [Display(Name = "Mobile Number")]
        public string? MobileNo { get; set; }

        [Display(Name = "Log In ID")]
        public string? LogInId { get; set; }

        [Display(Name = "Password")]
        public string? Password { get; set; }

        [Display(Name = "Change Password")]
        public bool? IsChangePassword { get; set; }

        public PeramModel PeramModel { get; set; }

        public ExamineeVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
