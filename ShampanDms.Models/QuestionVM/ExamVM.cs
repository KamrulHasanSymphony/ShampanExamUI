using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models.QuestionVM
{
    public class ExamVM : Audit
    {
        [Display(Name = "Exam")]
        public int Id { get; set; }

        [Display(Name = "Exam Code")]
        public string? Code { get; set; }

        [Display(Name = "Exam Name")]
        public string? Name { get; set; }
        [Display(Name = "Exam Subject")]
        public int? SubjectId { get; set; }
        [Display(Name = "Exam Date")]
        public string? Date { get; set; }

        [Display(Name = "Exam Time")]
        public TimeSpan? Time { get; set; }


        [Display(Name = "Duration(mins)")]
        public int Duration { get; set; }

        [Display(Name = "Total Marks")]
        public int TotalMark { get; set; }
        public int MarkObtain { get; set; }
        public bool IsExamMarksSubmitted { get; set; }


        [Display(Name = "Grade")]
        public int? GradeId { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        [Display(Name = "Is Exam By Question Set")]
        public bool IsExamByQuestionSet { get; set; }

        [Display(Name = "Question Set")]
        public int? QuestionSetId { get; set; }

        [Display(Name = "Examinee Group")]
        public int? ExamineeGroupId { get; set; }
        public int? ExamineeId { get; set; }
        public string? ExamineeName { get; set; }
        public List<ExamExamineeVM> examExamineeList { get; set; }
        public List<ExamQuestionHeaderVM> examQuestionHeaderList { get; set; }
        public List<ExamQuestionOptionDetailVM> examQuestionOptionDetailList { get; set; }
        public List<ExamQuestionShortDetailVM> examQuestionShortDetailList { get; set; }

        public PeramModel PeramModel { get; set; }

        public ExamVM()
        {
            examExamineeList = new List<ExamExamineeVM>();
            examQuestionHeaderList = new List<ExamQuestionHeaderVM>();
            examQuestionOptionDetailList = new List<ExamQuestionOptionDetailVM>();
            examQuestionShortDetailList = new List<ExamQuestionShortDetailVM>();

            PeramModel = new PeramModel();
        }
    }
}
