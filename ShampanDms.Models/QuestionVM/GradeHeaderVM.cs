using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ShampanTailor.Models.QuestionVM
{
    public class GradeHeaderVM : Audit
    {
        [Display(Name = "Grade Header")]
        public int Id { get; set; }

        [Display(Name = "Grade Name")]
        public string? Name { get; set; }

        [Display(Name = "Grade Code")]
        public string? Code { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        [Display(Name = "Grade Details")]
        public List<GradeDetailVM> gradeDetailList { get; set; }

        public GradeHeaderVM()
        {
            PeramModel = new PeramModel();
            gradeDetailList = new List<GradeDetailVM>();
        }
    }
}
