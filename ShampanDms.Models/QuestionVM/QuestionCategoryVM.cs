﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanTailor.Models.QuestionVM
{
    public class QuestionCategoryVM: Audit
    {
        [Display(Name = "Question Category")]
        public int Id { get; set; }

        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Name In Bangla")]
        public string? NameInBangla { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public PeramModel PeramModel { get; set; }

        public QuestionCategoryVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
