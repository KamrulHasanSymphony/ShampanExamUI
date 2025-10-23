using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class QuestionChapterVM : Audit
    {
        [Display(Name = "Chapter")]
        public int Id { get; set; }

        [Display(Name = "Chapter Name")]
        public string? Name { get; set; }

        [Display(Name = "Chapter Name in Bangla")]
        public string? NameInBangla { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionChapterVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
