var ExaminerController = function (CommonService, CommonAjaxService) {

    var init = function () {
        //var getOperation = $("#Operation").val() || '';
        var getId = $("#ExamineeId").val() || 0;
        //var getExamineeGroupId = $("#ExamineeGroupId").val() || 0;
        //var getQuestionSetId = $("#QuestionSetId").val() || 0;

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data

        if (getId == '') { 
            GetGridDataList()
            SelfGetGridDataList()
    }
        // Initialize Kendo UI components


        //function GetGradeComboBox() {
            
        //    var GradeComboBox = $("#GradeId").kendoMultiColumnComboBox({
        //        dataTextField: "Name",
        //        dataValueField: "Id",
        //        height: 400,
        //        columns: [
        //            { field: "Code", title: "Code", width: 150 },
        //            { field: "Name", title: "Name", width: 150 }
        //        ],
        //        filter: "contains",
        //        filterFields: ["Name"],
        //        dataSource: {
        //            transport: {
        //                read: "/Questions/Grade/Dropdown"
        //            }
        //        },
        //        placeholder: "Select Grade",
        //        value: "",
        //        dataBound: function (e) {
        //            if (getGradeId) {
        //                this.value(parseInt(getGradeId));
        //            }
        //        }
        //    }).data("kendoMultiColumnComboBox");
        //};
        //function GetExamineeGroupComboBox() {
            
        //    var ExamineeGroupComboBox = $("#ExamineeGroupId").kendoMultiColumnComboBox({
        //        dataTextField: "Name",
        //        dataValueField: "Id",
        //        height: 400,
        //        columns: [
        //            { field: "Name", title: "Name", width: 150 },
        //            { field: "Remarks", title: "Remarks", width: 150 }
        //        ],
        //        filter: "contains",
        //        filterFields: ["Name"],
        //        dataSource: {
        //            transport: {
        //                read: "/Questions/ExamineeGroup/Dropdown"
        //            }
        //        },
        //        placeholder: "Select Examinee Group",
        //        value: "",
        //        dataBound: function (e) {
        //            if (getExamineeGroupId) {
        //                this.value(parseInt(getExamineeGroupId));
        //            }
        //        }
        //    }).data("kendoMultiColumnComboBox");
        //};
        //function GetQuestionSetComboBox() {
            
        //    var QuestionSetComboBox = $("#QuestionSetId").kendoMultiColumnComboBox({
        //        dataTextField: "Name",
        //        dataValueField: "Id",
        //        height: 400,
        //        columns: [
        //            { field: "Name", title: "Name", width: 150 },
        //            { field: "Remarks", title: "Remarks", width: 150 }
        //        ],
        //        filter: "contains",
        //        filterFields: ["Name"],
        //        dataSource: {
        //            transport: {
        //                read: "/Questions/QuestionSet/Dropdown"
        //            }
        //        },
        //        placeholder: "Select Examinee Group",
        //        value: "",
        //        dataBound: function (e) {
        //            if (getQuestionSetId) {
        //                this.value(parseInt(getQuestionSetId));
        //            }
        //        }
        //    }).data("kendoMultiColumnComboBox");
        //};


        // Save button click handler
        $('.btnPost').click('click', function () {
            
            var getId = $('#Id').val();
            $("#actionType").val("Final");
       
                Confirmation("Are you sure? Do You Want to Submit Exam?", function (result) {
                    if (result) {
                        save();
                    }
                });
        });

        $('.btnsave').click('click', function () {

            var getId = $('#Id').val();
            $("#actionType").val("Draft");
           
                Confirmation("Are you want to Save: ", function (result) {
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


        $('input[name$=".ExaminerMarks"]').on('input', function () {
            var maxMark = parseFloat($(this).attr('max'));
            var value = parseFloat($(this).val());

            if (value > maxMark) {
                $(this).val(maxMark);
            } else if (value < 0) {
                $(this).val(0);
            }
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
                        url: "/Examiner/Examiner/GetGridData",
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
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "ExamDate") {
                                    param.field = "H.ExamDate";
                                }
                                if (param.field === "Status") {
                                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                    if (statusValue.startsWith("a")) {
                                        param.value = 1;
                                    } else if (statusValue.startsWith("i")) {
                                        param.value = 0;
                                    } else {
                                        param.value = null;
                                    }
                                    param.field = "H.IsActive";
                                    param.operator = "eq";
                                }
                            });
                        }

                        if (options.filter && options.filter.filters) {
                            options.filter.filters.forEach(function (param) {
                                if (param.field === "Id") {
                                    param.field = "H.Id";
                                }
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "ExamDate") {
                                    param.field = "H.ExamDate";
                                }
                                if (param.field === "Status") {
                                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                    if (statusValue.startsWith("a")) {
                                        param.value = 1;
                                    } else if (statusValue.startsWith("i")) {
                                        param.value = 0;
                                    } else {
                                        param.value = null;
                                    }

                                    param.field = "H.IsActive";
                                    param.operator = "eq";
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

            $("#GridDataList").kendoGrid({
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
                    fileName: `Exams_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
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
                    //{
                    //    title: "Action",
                    //    width: 40,
                    //    template: function (dataItem) {
                    //        return `
                    //            <a href="/Examiner/Examiner/Edit/${dataItem.ExamineeId}" class="btn btn-primary btn-sm mr-2 edit">
                    //                <i class="fas fa-pencil-alt"></i>
                    //            </a>`;
                    //    }
                    //},
                    {
                        title: "Action",
                        width: 40,
                        template: function (dataItem) {
                            console.log(dataItem);
                            return `
                            <a href="/Examiner/Examiner/Edit?id=${dataItem.ExamineeId}&examId=${dataItem.Id}"
                               class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                        }
                    },

                    { field: "Id", width: 50, hidden: true, sortable: true },
                    { field: "ExamineeId", width: 50, hidden: true, sortable: true },
                    { field: "Name", title: "Name", sortable: true, width: 200 },
                    { field: "ExamineeName", title: "Examinee Name", sortable: true, width: 200 },
                    { field: "Date", title: "Exam Date", sortable: true, width: 200 },
                    { field: "Duration", title: "Duration", sortable: true, width: 150 },
                    { field: "TotalMark", title: "Total Marks", sortable: true, width: 150 },
                    { field: "Status", title: "Status", sortable: true, width: 100 },
                ],
                editable: false,
                selectable: "multiple row",
                navigatable: true,
                columnMenu: true
            });
        };

        function SelfGetGridDataList() {
            var selfGridDataSource = new kendo.data.DataSource({
                type: "json",
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                allowUnsort: true,
                autoSync: true,
                pageSize: 10,
                transport: {
                    read: {
                        url: "/Examiner/Examiner/SelfGetGridData",
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
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "ExamDate") {
                                    param.field = "H.ExamDate";
                                }
                                if (param.field === "Status") {
                                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                    if (statusValue.startsWith("a")) {
                                        param.value = 1;
                                    } else if (statusValue.startsWith("i")) {
                                        param.value = 0;
                                    } else {
                                        param.value = null;
                                    }
                                    param.field = "H.IsActive";
                                    param.operator = "eq";
                                }
                            });
                        }

                        if (options.filter && options.filter.filters) {
                            options.filter.filters.forEach(function (param) {
                                if (param.field === "Id") {
                                    param.field = "H.Id";
                                }
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "ExamDate") {
                                    param.field = "H.ExamDate";
                                }
                                if (param.field === "Status") {
                                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                    if (statusValue.startsWith("a")) {
                                        param.value = 1;
                                    } else if (statusValue.startsWith("i")) {
                                        param.value = 0;
                                    } else {
                                        param.value = null;
                                    }

                                    param.field = "H.IsActive";
                                    param.operator = "eq";
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

            $("#SelfGridDataList").kendoGrid({
                dataSource: selfGridDataSource,
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
                    fileName: `Exams_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
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
                    //{
                    //    title: "Action",
                    //    width: 40,
                    //    template: function (dataItem) {
                    //        return `
                    //            <a href="/Examiner/Examiner/Edit/${dataItem.ExamineeId}" class="btn btn-primary btn-sm mr-2 edit">
                    //                <i class="fas fa-pencil-alt"></i>
                    //            </a>`;
                    //    }
                    //},
                    {
                        title: "Action",
                        width: 40,
                        template: function (dataItem) {
                            console.log(dataItem);
                            return `
                            <a href="/Examiner/Examiner/Edit?id=${dataItem.ExamineeId}&examId=${dataItem.Id}"
                               class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                        }
                    },

                    { field: "Id", width: 50, hidden: true, sortable: true },
                    { field: "ExamineeId", width: 50, hidden: true, sortable: true },
                    { field: "Name", title: "Name", sortable: true, width: 200 },
                    { field: "ExamineeName", title: "Examinee Name", sortable: true, width: 200 },
                    { field: "Date", title: "Exam Date", sortable: true, width: 200 },
                    { field: "Duration", title: "Duration", sortable: true, width: 150 },
                    { field: "TotalMark", title: "Total Marks", sortable: true, width: 150 },
                    { field: "Status", title: "Status", sortable: true, width: 100 },
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
            var formData = new FormData();
            var model = serializeInputs("frmEntry");

            var result = validator.form();

            if (!result) {
                if (!result) {
                    validator.focusInvalid();
                }
                return;
            }

            for (var key in model) {
                formData.append(key, model[key]);
            }

            formData.append("actionType", $("#actionType").val());
             
            var url = "/Examiner/Examiner/CreateEdit";
            CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
        }

        // Handle success
        function saveDone(result) {
            if (result.Status == 200) {
                ShowNotification(1, result.Message);
                if ($('#actionType').val() === 'Final') {
                    $('.btnsave').hide();
                    $('.btnPost').hide();
                }
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
