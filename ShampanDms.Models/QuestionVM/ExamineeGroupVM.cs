using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanTailor.Models.QuestionVM
{
    public class ExamineeGroupVM : Audit
    {
        [Display(Name = "Examinee Group")]
        public int Id { get; set; }

        [Display(Name = "Group Name")]
        public string? Name { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        public ExamineeGroupVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
