using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class QuestionSetDetailVM : Audit
    {
        [Display(Name = "Question Set Detail")]
        public int Id { get; set; }

        [Display(Name = "Question Set Header")]
        public int? QuestionSetHeaderId { get; set; }

        [Display(Name = "Question Header")]
        public int? QuestionHeaderId { get; set; }

        [Display(Name = "Question Mark")]
        public int? QuestionMark { get; set; }

        [Display(Name = "Question Text")]
        public string? QuestionText { get; set; }

        [Display(Name = "Question Type")]
        public string? QuestionType { get; set; }

        [Display(Name = "Question Set Header Name")]
        public string? QuestionSetHeaderName { get; set; }

        [Display(Name = "Question Header Name")]
        public string? QuestionHeaderName { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionSetDetailVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
