﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanExam.Models.QuestionVM
{
    public class ExamQuestionHeaderVM
    {
        public int Id { get; set; }
        public int? ExamId { get; set; }
        public int? ExamineeId { get; set; }
        public int? QuestionHeaderId { get; set; }
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public int? QuestionMark { get; set; }
        public decimal? MarkObtain { get; set; }

    }
}
