using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class QuestionSubjectVM : Audit
    {
        [Display(Name = "Subject")]
        public int Id { get; set; }

        [Display(Name = "Subject Name")]
        public string? Name { get; set; }

        [Display(Name = "Subject Name in Bangla")]
        public string? NameInBangla { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionSubjectVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
