using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanExam.Models.Exam
{
    public class ExamReportHeaderVM
    {
        public int? Id { get; set; }
        public string? ExamName { get; set; }
        public string? ExamCode { get; set; }
        public string? Duration { get; set; }
        public string? ExamDate { get; set; }
        public string? TotalMark { get; set; }

        // Details List
        public List<ExamReportDetailVM> examReportDetailList { get; set; }


        public ExamReportHeaderVM()
        {
            examReportDetailList = new List<ExamReportDetailVM>();
        }
    }
}
