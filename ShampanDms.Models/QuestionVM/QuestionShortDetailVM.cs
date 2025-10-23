using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanTailor.Models.QuestionVM
{
    public class QuestionShortDetailVM : Audit
    {
        [Display(Name = "Question")]
        public int Id { get; set; }

        [Display(Name = "Question Header")]
        [Required(ErrorMessage = "Question Header is required")]
        public int QuestionHeaderId { get; set; }

        [Display(Name = "Question Answer")]
        [Required(ErrorMessage = "Question Answer is required")]
        public string? QuestionAnswer { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionShortDetailVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
