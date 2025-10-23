using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ShampanExam.Models.QuestionVM
{
    public class QuestionSetHeaderVM : Audit
    {
        [Display(Name = "Question Set Header")]
        public int Id { get; set; }

        [Display(Name = "Question Set Name")]
        public string? Name { get; set; }

        [Display(Name = "Total Marks")]
        public int? TotalMark { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        [Display(Name = "Question Set Details")]
        public List<QuestionSetDetailVM> questionSetDetailList { get; set; }

        public QuestionSetHeaderVM()
        {
            PeramModel = new PeramModel();
            questionSetDetailList = new List<QuestionSetDetailVM>();
        }
    }
}
