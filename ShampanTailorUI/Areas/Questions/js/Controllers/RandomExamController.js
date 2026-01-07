var RandomExamController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getGradeId = $("#GradeId").val() || 0;
        var getExamineeGroupId = $("#ExamineeGroupId").val() || 0;
        var getQuestionSetId = $("#QuestionSetId").val() || 0;
        // Initial load
        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
        // Initialize Kendo UI components
        //GetGradeComboBox();
        //GetExamineeGroupComboBox();
        //GetQuestionSetComboBox();

        var examDetailList = JSON.parse($("#automatedExamDetailListJson").val() || "[]");

        var kAddedQuestions = new kendo.data.DataSource({
            data: examDetailList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        AutomatedExamId: { type: "number", defaultValue: null },
                        SubjectId: { type: "number", defaultValue: null },
                        NumberOfQuestion: { type: "number", defaultValue: 0 },
                        QuestionType: { type: "string", defaultValue: "" },
                        QuestionMark: { type: "number", defaultValue: 0 }
                    }
                }
            },
            aggregate: [
                { field: "NumberOfQuestion", aggregate: "sum" },
                { field: "QuestionMark", aggregate: "sum" }
            ],
            change: function (e) {
                
            }
        });

        $("#kAddedQuestions").kendoGrid({
            dataSource: kAddedQuestions,
            toolbar: [{ name: "create", text: "Add" }],
            editable: { mode: "incell", createAt: "bottom" },
            save: function () {
                var grid = this;
                setTimeout(() => {
                    grid.refresh();
                }, 0);
            },
            dataBound: function () {
                   
            },
            columns: [
                {
                    title: "SL",
                    width: 30,
                    template: function (dataItem) {
                        var grid = $("#kAddedQuestions").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    },
                    attributes: { style: "text-align:center;" }
                },
                { field: "AutomatedExamId", title: "AutomatedExamId", width: 150, hidden: true },
                {
                    field: "SubjectName",
                    title: "Subject",
                    width: 150,
                    editor: function (container, options) {
                        $('<input required data-bind="value:' + options.field + '" />')
                            .appendTo(container)
                            .kendoComboBox({
                                dataTextField: "Name",
                                dataValueField: "Id",
                                dataSource: {
                                    transport: {
                                        read: "/Common/Common/GetSubjectList"
                                    }
                                },
                                filter: "contains",
                                placeholder: "Select Subject",
                                value: options.model.SubjectId, // <-- pre-select the value based on SubjectId
                                change: function (e) {
                                    var selected = this.dataItem();
                                    if (selected) {
                                        options.model.SubjectName = selected.Name;
                                        options.model.SubjectId = selected.Id;
                                    }
                                }
                            });
                    }

                    //editor: function (container, options) {

                    //    $('<input required id="cmbCard" data-bind="value:' + options.field + '" />')
                    //        .appendTo(container)
                    //        .kendoComboBox({
                    //            dataTextField: "Name",
                    //            dataValueField: "Id",
                    //            dataSource: {
                    //                transport: {
                    //                    read: "/Common/Common/GetSubjectList"
                    //                }
                    //            },
                    //            filter: "contains",
                    //            placeholder: "Select Subject",

                    //            change: function (e) {
                    //                var selected = this.dataItem();

                    //                if (selected) {
                    //                    options.model.SubjectName = selected.Name;

                    //                    options.model.SubjectId = selected.Id;
                    //                }
                    //            }
                    //        });
                    //}
                },
                
                {
                    field: "NumberOfQuestion",
                    title: "Number Of Question",
                    width: 100,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b> #= kendo.toString(sum, 'n2') #</b>"
                },
                
                {
                    field: "QuestionType",
                    title: "QuestionType",
                    width: 150,
                    editor: function (container, options) {

                        $('<input required id="cmbCard" data-bind="value:' + options.field + '" />')
                            .appendTo(container)
                            .kendoComboBox({
                                dataTextField: "Name",
                                dataValueField: "Name",
                                dataSource: {
                                    transport: {
                                        read: "/Common/Common/GetQuestionTypeList"
                                    }
                                },
                                filter: "contains",
                                placeholder: "Select Question Type",

                                change: function (e) {
                                    var selected = this.dataItem();

                                    if (selected) {
                                        options.model.QuestionType = selected.Name;
                                    }
                                }
                            });
                    }
                },
                {
                    field: "QuestionMark",
                    title: "Question Mark",
                    width: 100,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b> #= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    command: [{ name: "destroy", iconClass: "k-icon k-i-trash", text: "" }],
                    title: "&nbsp;",
                    width: 40
                }
            ]
        });

        // Save button click handler
        $('.btnsave').click('click', function () {
            
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    save();
                }
            });
        });

        // Delete button click handler
        $('.btnDelete').on('click', function () {
            Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                if (result) {
                    SelectData();
                }
            });
        });

        // Fetch grid data
        function GetGridDataList() {
            
            var gridDataSource = new kendo.data.DataSource({
                type: "json",
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                allowUnsort: true,
                autoSync: true,
                pageSize: 10,
                transport: {
                    read: {
                        url: "/Questions/Exam/RandomGetGridData",
                        type: "POST",
                        dataType: "json",
                        cache: false
                    },
                    parameterMap: function (options) {
                        if (options.sort) {
                            options.sort.forEach(function (param) {
                                if (param.field === "Id") {
                                    param.field = "H.Id";
                                }
                                if (param.field === "ExamCode") {
                                    param.field = "H.Code";
                                }
                                if (param.field === "SubjectName") {
                                    param.field = "S.Name";
                                }
                                if (param.field === "NumberOfQuestion") {
                                    param.field = "D.NumberOfQuestion";
                                }
                                if (param.field === "QuestionType") {
                                    param.field = "D.QuestionType";
                                }
                                if (param.field === "QuestionMark") {
                                    param.field = "D.QuestionMark";
                                }
                            });
                        }

                        if (options.filter && options.filter.filters) {
                            options.filter.filters.forEach(function (param) {
                                if (param.field === "Id") {
                                    param.field = "H.Id";
                                }
                                if (param.field === "ExamCode") {
                                    param.field = "H.Code";
                                }
                                if (param.field === "SubjectName") {
                                    param.field = "S.Name";
                                }
                                if (param.field === "NumberOfQuestion") {
                                    param.field = "D.NumberOfQuestion";
                                }
                                if (param.field === "QuestionType") {
                                    param.field = "D.QuestionType";
                                }
                                if (param.field === "QuestionMark") {
                                    param.field = "D.QuestionMark";
                                }
                            });
                        }

                        return options;
                    }
                },
                batch: true,
                schema: {
                    data: "Items",
                    total: "TotalCount"
                }
            });

            $("#GridDataListRandom").kendoGrid({
                
                dataSource: gridDataSource,
                pageable: {
                    refresh: true,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    pageSizes: [10, 20, 50, "all"]
                },
                noRecords: true,
                messages: {
                    noRecords: "No Record Found!"
                },
                scrollable: true,
                filterable: {
                    extra: true,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            endswith: "Ends with",
                            contains: "Contains",
                            doesnotcontain: "Does not contain",
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            gt: "Is greater than",
                            lt: "Is less than"
                        }
                    }
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                groupable: true,
                toolbar: ["excel", "pdf", "search"],
                excel: {
                    fileName: "Exams.xlsx",
                    filterable: true
                },
                pdf: {
                    fileName: `RandomExams_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
                    allPages: true,
                    avoidLink: true,
                    filterable: true
                },
                pdfExport: function (e) {
                    $(".k-grid-toolbar").hide();
                    $(".k-grouping-header").hide();
                    $(".k-floatwrap").hide();

                    var companyName = "Shampan Exam System.";
                    var fileName = `Exams_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

                    e.sender.options.pdf = {
                        paperSize: "A4",
                        margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                        landscape: true,
                        allPages: true,
                        template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>${companyName}</div>
                            </div> `
                    };

                    e.sender.options.pdf.fileName = fileName;

                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                },
                columns: [
                    {
                        title: "Action",
                        width: 80,
                        template: function (dataItem) {
                            return `
        <a href="/Questions/Exam/RandomEdit/${dataItem.Id}"
           class="btn btn-primary btn-sm mr-2 edit" 
           title="Edit">
            <i class="fas fa-pencil-alt"></i>
        </a>
    `;
                        }
                    },
                    { field: "Id", width: 50, hidden: true, sortable: true },
                    { field: "ExamCode", title: "Exam Code", sortable: true, width: 200 },
                    { field: "SubjectName", title: "Subject", sortable: true, width: 200 },
                    { field: "NumberOfQuestion", title: "Number Of Question", sortable: true, width: 150 },
                    { field: "QuestionType", title: "Question Type", sortable: true, width: 150 },
                    { field: "QuestionMark", title: "Question Mark", sortable: true, width: 100 },
                ],
                editable: false,
                selectable: "multiple row",
                navigatable: true,
                columnMenu: true
            });
        };

        // Save the form data
        function save() {
            var validator = $("#frmEntry").validate();
            //var formData = new FormData();
            var model = serializeInputs("frmEntry");

            var result = validator.form();

            if (!result) {
                if (!result) {
                    validator.focusInvalid();
                }
                return;
            }

            var totalMarkInput = $("#TotalMark").val();   // MVC TextBoxFor → id="TotalMark"
            var totalMark = parseFloat(totalMarkInput) || 0;

            var sumQuestionMarks = 0;
            var examDetails = [];
            if ($('#IsExamByQuestionSet').is(':not(:checked)')) {
                var automatedExamGrid = $("#kAddedQuestions").data("kendoGrid");
                if (automatedExamGrid) {
                    var cardItems = automatedExamGrid.dataSource.view();
                    for (var i = 0; i < cardItems.length; i++) {
                        var cardItem = cardItems[i];
                        var mark = parseFloat(cardItems[i].QuestionMark) || 0;
                        sumQuestionMarks += mark;
                        examDetails.push({
                            Id: cardItem.Id,
                            AutomatedExamId: cardItem.AutomatedExamId,
                            SubjectId: cardItem.SubjectId,
                            NumberOfQuestion: cardItem.NumberOfQuestion,
                            QuestionType: cardItem.QuestionType,
                            QuestionMark: cardItem.QuestionMark
                        });
                    }
                }
                if (automatedExamGrid) {
                    if (sumQuestionMarks !== totalMark) {

                        ShowNotification(3, "Total Mark and Exam Policy Mark Not same!");
                        return;
                    }
                }
            }
            model.automatedExamDetailList = examDetails;

            //for (var key in model) {
            //    formData.append(key, model[key]);
            //}

            model.IsActive = $('#IsActive').prop('checked');
            model.IsExamByQuestionSet = $('#IsExamByQuestionSet').prop('checked');

            var url = "/Questions/Exam/CreateEdit";
            CommonAjaxService.finalSave(url, model, saveDone, saveFail);
        }

        // Handle success
        function saveDone(result) {
            
            if (result.Data.Operation == "add") {
                if (result.Status == 200) {
                    ShowNotification(1, result.Message);
                    $(".divSave").hide();
                    $(".divUpdate").show();
                    if (result.Data.IsExamByQuestionSet == false) {
                        $("#btnRandomProcess").show();
                        $('#btnProcess').hide();
                    }
                    else {
                        $('#btnProcess').show();
                        $("#btnRandomProcess").hide();

                    }
                    
                    $("#Id").val(result.Data.Id);
                    $("#Code").val(result.Data.Code);
                    $("#Operation").val("update");
                    
                    window.location.href = '/Questions/Exam/Edit?id=' + result.Data.Id;

                }
            }
            else
            {
                ShowNotification(1, result.Message);

            }
        }
        
        // Handle fail
        function saveFail(result) {
            ShowNotification(3, "Query Exception!");
        }

        // Handle delete done
        function deleteDone(result) {
            var grid = $('#GridDataList').data('kendoGrid');
            if (grid) {
                grid.dataSource.read();
            }

            if (result.Status == 200) {
                ShowNotification(1, result.Message);
            }
        }

    }

        return {
            init: init
        }
    }(CommonService, CommonAjaxService);
