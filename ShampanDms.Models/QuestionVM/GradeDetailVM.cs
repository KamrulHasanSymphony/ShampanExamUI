using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanTailor.Models.QuestionVM
{
    public class GradeDetailVM : Audit
    {
        [Display(Name = "Grade Detail")]
        public int Id { get; set; }

        [Display(Name = "Grade")]
        public int? GradeId { get; set; }

        [Display(Name = "Grade Name")]
        public string? Grade { get; set; }

        [Display(Name = "Minimum Percentage")]
        public int? MinPercentage { get; set; }

        [Display(Name = "Maximum Percentage")]
        public decimal? MaxPercentage { get; set; }

        [Display(Name = "Grade Point")]
        public decimal? GradePoint { get; set; }

        [Display(Name = "Grade Point Note")]
        public string GradePointNote { get; set; }

        public PeramModel PeramModel { get; set; }

        public GradeDetailVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
