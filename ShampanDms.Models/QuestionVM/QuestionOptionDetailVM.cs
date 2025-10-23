using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanTailor.Models.QuestionVM
{
    public class QuestionOptionDetailVM : Audit
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Question Header is required")]
        [Display(Name = "Question Header")]
        public int QuestionHeaderId { get; set; }

        [Required(ErrorMessage = "Question Option is required")]
        [StringLength(50, ErrorMessage = "Question Option should not exceed 50 characters")]
        [Display(Name = "Question Option")]
        public string? QuestionOption { get; set; }

        [Required(ErrorMessage = "Question Answer is required")]
        [Display(Name = "Question Answer")]
        public bool QuestionAnswer { get; set; }

        public PeramModel PeramModel { get; set; }
        public QuestionOptionDetailVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
