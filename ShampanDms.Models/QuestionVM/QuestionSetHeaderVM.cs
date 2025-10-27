using ShampanTailor.Models.QuestionVM;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class QuestionSetHeaderVM : Audit
    {
        [Display(Name = "Question Set Header")]
        public int Id { get; set; }

        [Display(Name = "Question Set Name")]
        public string? Name { get; set; }

        [Display(Name = "Question Subject")]
        public int? QuestionSubjectId { get; set; }
        [Display(Name = "Question Chapter")]
        public int? QuestionChapterId { get; set; }

        [Display(Name = "Total Marks")]
        public int? TotalMark { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public bool IsPost { get; set; }

        public PeramModel PeramModel { get; set; }

        [Display(Name = "Question Set Details")]
        public List<QuestionSetDetailVM> questionSetDetailList { get; set; }
        //public List<QuestionSetQuestionVM> questionSetQuestionList { get; set; }
        public QuestionSetHeaderVM()
        {
            PeramModel = new PeramModel();
            questionSetDetailList = new List<QuestionSetDetailVM>();
            //questionSetQuestionList = new List<QuestionSetQuestionVM>();
        }
    }
}
