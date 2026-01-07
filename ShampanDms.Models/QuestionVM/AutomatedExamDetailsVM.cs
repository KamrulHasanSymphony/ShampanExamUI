using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanTailor.Models.QuestionVM
{
    public class AutomatedExamDetailsVM
    {
        public int Id { get; set; }
        public string? AutomatedExamId { get; set; }
        public int? SubjectId { get; set; }
        public int? NumberOfQuestion { get; set; }
        public string? QuestionType { get; set; }
        public decimal? QuestionMark { get; set; }
        public string? SubjectName { get; set; }
        public string? ExamCode { get; set; }


    }
}
