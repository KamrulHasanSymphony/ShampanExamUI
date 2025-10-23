var QuestionController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getQuestionSubjectId = $("#QuestionSubjectId").val() || 0;
        var getQuestionChapterId = $("#QuestionChapterId").val() || 0;
        var getQuestionCategorieId = $("#QuestionCategorieId").val() || 0;

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        GetQuestionSubjectComboBox();
        GetQuestionChapterComboBox();
        GetQuestionCategoryComboBox();

        function GetQuestionSubjectComboBox() {
            debugger;
            var QuestionSubjectComboBox = $("#QuestionSubjectId").kendoMultiColumnComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Name", title: "Name", width: 150 },
                    { field: "Remarks", title: "Remarks", width: 150 }
                ],
                filter: "contains",
                filterFields: ["Name"],
                dataSource: {
                    transport: {
                        read: "/Questions/QuestionSubject/Dropdown"
                    }
                },
                placeholder: "Select Question Subject",
                value: "",
                dataBound: function (e) {
                    if (getQuestionSubjectId) {
                        this.value(parseInt(getQuestionSubjectId));
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };
        function GetQuestionChapterComboBox() {
            debugger;
            var QuestionChapterComboBox = $("#QuestionChapterId").kendoMultiColumnComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Name", title: "Name", width: 150 },
                    { field: "Remarks", title: "Remarks", width: 150 }
                ],
                filter: "contains",
                filterFields: ["Name"],
                dataSource: {
                    transport: {
                        read: "/Questions/QuestionChapter/Dropdown"
                    }
                },
                placeholder: "Select Question Chapter",
                value: "",
                dataBound: function (e) {
                    if (getQuestionChapterId) {
                        this.value(parseInt(getQuestionChapterId));
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };
        function GetQuestionCategoryComboBox() {
            debugger;
            var QuestionCategoryComboBox = $("#QuestionCategorieId").kendoMultiColumnComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Name", title: "Name", width: 150 },
                    { field: "Remarks", title: "Remarks", width: 150 }
                ],
                filter: "contains",
                filterFields: ["Name"],
                dataSource: {
                    transport: {
                        read: "/Questions/QuestionCategory/Dropdown"
                    }
                },
                placeholder: "Select Question Category",
                value: "",
                dataBound: function (e) {
                    if (getQuestionCategorieId) {
                        this.value(parseInt(getQuestionCategorieId));
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };

        // Initialize the question option details grid
        var $tableOption = $('#questionOptionDetails');
        var tableOption = initEditTable($tableOption, { searchHandleAfterEdit: false });

        var questionOptionDetails = JSON.parse($("#QuestionOptionDetailsJson").val() || "[]");

        var questionOptionDetailsGrid = new kendo.data.DataSource({
            data: questionOptionDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        QuestionOption: { type: "string", defaultValue: "" },
                        QuestionAnswer: { type: "boolean", defaultValue: false }
                    }
                }
            }
        });

        $("#questionOptionDetails").kendoGrid({
            dataSource: questionOptionDetailsGrid,
            toolbar: [{ name: "create", text: "Add Option" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            save: function (e) {
                const grid = this;
                setTimeout(function () {
                    grid.dataSource.aggregate();
                    grid.refresh();
                }, 0);
            },
            columns: [
                {
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#questionOptionDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                { field: "QuestionOption", title: "Option", width: 150 },
                { field: "QuestionAnswer", title: "Is Answer", width: 100 },
                {
                    command: [{
                        name: "destroy",
                        iconClass: "k-icon k-i-trash",
                        text: ""
                    }],
                    title: "&nbsp;",
                    width: 35
                }
            ]
        });

        // Initialize the question short answer details grid
        var $tableShort = $('#questionShortDetails');
        var tableShort = initEditTable($tableShort, { searchHandleAfterEdit: false });

        var questionShortDetails = JSON.parse($("#QuestionShortDetailsJson").val() || "[]");

        var questionShortDetailsGrid = new kendo.data.DataSource({
            data: questionShortDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        QuestionAnswer: { type: "string", defaultValue: "" }
                    }
                }
            }
        });

        $("#questionShortDetails").kendoGrid({
            dataSource: questionShortDetailsGrid,
            toolbar: [{ name: "create", text: "Add Short Answer" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            save: function (e) {
                const grid = this;
                setTimeout(function () {
                    grid.dataSource.aggregate();
                    grid.refresh();
                }, 0);
            },
            columns: [
                {
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#questionShortDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                { field: "QuestionAnswer", title: "Answer", width: 150 },
                {
                    command: [{
                        name: "destroy",
                        iconClass: "k-icon k-i-trash",
                        text: ""
                    }],
                    title: "&nbsp;",
                    width: 35
                }
            ]
        });

        // Save button click handler
        $('.btnsave').click(function () {
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save();
                    }
                });
        });

        // Fetch grid data for the list
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
                        url: "/Questions/Question/GetGridData",
                        type: "POST",
                        dataType: "json",
                        cache: false
                    },
                    parameterMap: function (options) {
                        if (options.sort) {
                            options.sort.forEach(function (param) {
                                if (param.field === "ID") {
                                    param.field = "H.Id";
                                }
                                if (param.field === "Code") {
                                    param.field = "H.Code";
                                }
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "QuestionText") {
                                    param.field = "H.QuestionText";
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
                            neq: "Is not equal to"
                        }
                    }
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                groupable: true,
                toolbar: ["excel", "pdf", "search"],
                excel: {
                    fileName: "Questions.xlsx",
                    filterable: true
                },
                pdf: {
                    fileName: `Questions_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
                    allPages: true,
                    avoidLink: true,
                    filterable: true
                },
                columns: [
                    {
                        title: "Action",
                        width: 40,
                        template: function (dataItem) {
                            return `
                            <a href="/Questions/Question/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                        }
                    },
                    { field: "Id", title: "ID", width: 100, hidden: true },
                    { field: "QuestionText", title: "Question Text", width: 200 },
                    { field: "QuestionType", title: "Question Type", width: 150 },
                    { field: "QuestionMark", title: "Marks", width: 100 }
                ]
            });
        }

        // Save the form data
        function save() {
            debugger;
            var validator = $("#frmEntry").validate();
            if (!validator.form()) {
                validator.focusInvalid();
                return;
            }

            var model = serializeInputs("frmEntry");
            var formData = new FormData();

            var OptionDetails = [];
            var gridOption = $("#questionOptionDetails").data("kendoGrid");
            if (gridOption) {
                var dataItems = gridOption.dataSource.view();
                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];
                    OptionDetails.push({
                        QuestionOption: item.QuestionOption,
                        QuestionAnswer: item.QuestionAnswer
                    });
                }
            }

            var ShortDetails = [];
            var gridShort = $("#questionShortDetails").data("kendoGrid");
            if (gridShort) {
                var dataItems = gridShort.dataSource.view();
                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];
                    ShortDetails.push({
                        QuestionAnswer: item.QuestionAnswer
                    });
                }
            }

            model.QuestionOptionDetails = OptionDetails;
            model.QuestionShortDetails = ShortDetails;

            for (var key in model) {
                if (key !== "QuestionOptionDetails" && key !== "QuestionShortDetails") {
                    formData.append(key, model[key]);
                }
            }

            model.QuestionOptionDetails.forEach(function (detail, i) {
                for (var key in detail) {
                    if (detail.hasOwnProperty(key)) {
                        formData.append(`QuestionOptionDetails[${i}].${key}`, detail[key]);
                    }
                }
            });

            model.QuestionShortDetails.forEach(function (detail, i) {
                for (var key in detail) {
                    if (detail.hasOwnProperty(key)) {
                        formData.append(`QuestionShortDetails[${i}].${key}`, detail[key]);
                    }
                }
            });

            CommonAjaxService.finalImageSave("/Questions/Question/CreateEdit", formData, saveDone, saveFail);
        }

        // Save done handler
        function saveDone(result) {
            if (result.Status == 200) {
                ShowNotification(1, result.Message);
            } else if (result.Status == 400) {
                ShowNotification(3, result.Message);
            } else {
                ShowNotification(2, result.Message);
            }
        }

        // Save fail handler
        function saveFail(result) {
            ShowNotification(3, "Error during save!");
        }

        return {
            init: init
        };
    };

    return {
        init: init
    };
}(CommonService, CommonAjaxService);
