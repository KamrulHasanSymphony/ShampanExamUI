var SelfCreateController = function (CommonService, CommonAjaxService) {

    var getQuestionSubject = $("#SubjectId").val();
    var init = function () {

        GetSubjectComboBox();
        //GetQuestionTypeComboBox();

        $(document).on("click", "#btnRandomProcess", function () {
            var subjectCombo = $("#SubjectId").data("kendoMultiColumnComboBox");
            var questionSubjectId = subjectCombo ? subjectCombo.value() : "";

            //var noOfQuestion = $("#NumberOfQuestion").val();

            $(".validation-msg").text("");
            $(".form-control").removeClass("is-invalid");
            $(".k-widget").removeClass("is-invalid");

            var isValid = true;

            if (!questionSubjectId) {
                $("#SubjectId_error").text("Fill this field");
                $("#SubjectId").closest(".k-widget").addClass("is-invalid");
                isValid = false;
            }

            //if (!noOfQuestion || noOfQuestion <= 0) {
            //    $("#NumberOfQuestion_error").text("Fill this field");
            //    $("#NumberOfQuestion").addClass("is-invalid");
            //    isValid = false;
            //}

            if (!isValid) {
                ShowNotification("Please fill all required fields.");
                return;
            }

            randomProcessHandler();
        });

        $(document).on("change keyup", "#SubjectId, #QuestionType, #NumberOfQuestion, #QuestionMark", function () {

            var $colDiv = $(this).closest(".col-md-3"); 
            $colDiv.find(".validation-msg").text("");

            $(this).removeClass("is-invalid");

            // Kendo field special
            if ($(this).closest(".k-widget").length) {
                $(this).closest(".k-widget").removeClass("is-invalid");
            }
        });

    };

    var randomProcessHandler = function () {

        var questionSubjectId = $("#SubjectId").val() || '';

        var singleOptionNo = $("#SingleOptionNo").val();
        var multiOptionNo = $("#MultiOptionNo").val();

        //var questionType = $("#QuestionType").val() || '';
        //var questionMark = $("#QuestionMark").val();

        $.ajax({
            url: '/Questions/Exam/GetUserRandomProcessedData',
            type: 'GET',
            data: {
                questionSubjectId,
                singleOptionNo,
                multiOptionNo
                //questionType,
                //,questionMark
            },
            beforeSend: function () {
                $(".btnRandomProcess").prop("disabled", true).text("Processing...");
            },
            success: function (response) {
                if (response.success) {
                    var data = response.data;
                    debugger;
                    var examineeId = encodeURIComponent(data.examExamineeList[0].ExamineeId);
                    var examId = encodeURIComponent(data.examExamineeList[0].ExamId);
                    debugger;
                    window.location.href = `/Exam/Exam/EditSelf?id=${examineeId}&examId=${examId}`;
                } else {
                    ShowNotification(response.message || "Error");
                }
            },
            complete: function () {
                $(".btnRandomProcess").prop("disabled", false).text("Process");
            }
        });
    };

    function GetSubjectComboBox() {
        $("#SubjectId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [{ field: "Name", title: "Name", width: 150 }],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetSubjectList"
                    }
                }
            },
            placeholder: "Select Subject",
            value: "",
            dataBound: function () {
                if (getQuestionSubject) {
                    this.value(getQuestionSubject);
                }
            }
        });
    }

    //function GetQuestionTypeComboBox() {
    //    $("#QuestionType").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Name",
    //        height: 400,
    //        columns: [{ field: "Name", title: "Name", width: 150 }],
    //        filter: "contains",
    //        filterFields: ["Name"],
    //        dataSource: {
    //            transport: {
    //                read: {
    //                    url: "/Common/Common/GetQuestionTypeList"
    //                }
    //            }
    //        },
    //        placeholder: "Select Question Type",
    //        value: "",
    //        dataBound: function () {
    //            if (questionType) {
    //                this.value(questionType);
    //            }
    //        }
    //    });
    //}

    return {
        init: init
    };

}(CommonService, CommonAjaxService);