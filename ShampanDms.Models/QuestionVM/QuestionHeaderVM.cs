using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanTailor.Models.QuestionVM
{
    public class QuestionHeaderVM : Audit
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Question Subject is required")]
        [Display(Name = "Question Subject")]
        public int? QuestionSubjectId { get; set; }

        [Required(ErrorMessage = "Question Chapter is required")]
        [Display(Name = "Question Chapter")]
        public int? QuestionChapterId { get; set; }

        [Required(ErrorMessage = "Question Category is required")]
        [Display(Name = "Question Category")]
        public int? QuestionCategorieId { get; set; }

        [Required(ErrorMessage = "Question Text is required")]
        [Display(Name = "Question Text")]
        public string? QuestionText { get; set; }

        [Required(ErrorMessage = "Question Type is required")]
        [Display(Name = "Question Type")]
        public string? QuestionType { get; set; }

        [Required(ErrorMessage = "Question Mark is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Question Mark must be a positive integer")]
        [Display(Name = "Question Mark")]
        public int? QuestionMark { get; set; }

        public List<QuestionOptionDetailVM> QuestionOptionDetails { get; set; }
        public List<QuestionShortDetailVM> QuestionShortDetails { get; set; }
        public PeramModel PeramModel { get; set; }

        public QuestionHeaderVM()
        {
            QuestionOptionDetails = new List<QuestionOptionDetailVM>();
            QuestionShortDetails = new List<QuestionShortDetailVM>();
            PeramModel = new PeramModel();
        }
    }

    public enum QuestionTypeEnum
    {
        SingleOption,
        MultiOption,
        SingleLine,
        MultiLine
    }
}
