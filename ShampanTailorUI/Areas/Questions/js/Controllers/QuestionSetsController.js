var QuestionSetsController = (function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getQuestionSubjectId = $("#QuestionSubjectId").val() || 0;
        var getQuestionChapterId = $("#QuestionChapterId").val() || 0;

        // Index page
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
            GenerateDatePicker();
        }

        // Create/Edit page
        if (getOperation !== '') {
            GetQuestionSubjectComboBox();
            LoadChaptersCombo();
            GetCategoryComboBox();
            LoadQuestionGrids(getQuestionChapterId);
            LoadDetailGridData(getId);
            LoadAddedQuestionsGrid();
        }

        if (getOperation == "update") {
            LoadDetailGridData(getId);
            LoadQuestionGrids(getQuestionChapterId);
        }

        // ✅ Save Button
        $('.btnsave').click('click', function () {
            var getId = $('#Id').val();
            var status = (parseInt(getId) > 0) ? "Update" : "Save";
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) save();
            });
        });

        // ✅ Post Button
        $('.btnPost').on('click', function () {
            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                if (result) {
                    var model = serializeInputs("frmEntry");
                    if (model.IsPost == "True") {
                        ShowNotification(3, "Data has already been Posted.");
                        return;
                    }
                    model.IDs = model.Id;
                    var url = "/Exam/QuestionSet/MultiplePost";
                    CommonAjaxService.multiplePost(url, model, postDone, fail);
                }
            });
        });

        // ✅ Navigation
        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0)
                window.location.href = "/Exam/QuestionSet/NextPrevious?id=" + getId + "&status=Previous";
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0)
                window.location.href = "/Exam/QuestionSet/NextPrevious?id=" + getId + "&status=Next";
        });

        // ✅ Filter/Search
        $("#indexSearch").on('click', function () {
            const branchId = $("#Branchs").data("kendoMultiColumnComboBox").value();
            if (!branchId) {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }
            GetGridDataList();
        });
    };

    // =========================
    // 🔹 ComboBoxes
    // =========================

    function GetQuestionSubjectComboBox() {
        $("#QuestionSubjectId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
                { field: "Remarks", title: "Remarks", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Name", "Remarks"],
            dataSource: {
                transport: {
                    read: { url: "/Questions/QuestionSubject/Dropdown", dataType: "json" }
                }
            },
            placeholder: "Select Question Subject",
            change: function (e) {
                var getQuestionSubjectId = this.value();
                LoadChaptersCombo(getQuestionSubjectId); // ✅ call on change
            }
        });
    }

    function LoadChaptersCombo(getQuestionSubjectId) {
        var chapterCombo = $("#QuestionChapterId").data("kendoMultiColumnComboBox");
        if (!chapterCombo) {
            $("#QuestionChapterId").kendoMultiColumnComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Name", title: "Name", width: 150 },
                    { field: "Remarks", title: "Remarks", width: 150 }
                ],
                filter: "contains",
                filterFields: ["Name", "Remarks"],
                dataSource: [], 
                placeholder: "Select Question Chapter",
                change: function (e) {
                    var getQuestionChapterId = this.value();
                    if (getQuestionChapterId && getQuestionChapterId !== "0") {
                        LoadQuestionGrids(getQuestionChapterId);
                    } else {
                        ClearQuestionGrid();
                    }
                }
            });
            chapterCombo = $("#QuestionChapterId").data("kendoMultiColumnComboBox");
        }

        // ✅ If subject is selected, reload chapters dynamically
        if (getQuestionSubjectId && getQuestionSubjectId !== "0") {
            chapterCombo.setDataSource(new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/Questions/QuestionChapter/Dropdown?subjectId=" + getQuestionSubjectId,
                        dataType: "json"
                    }
                }
            }));
            chapterCombo.value(""); // Reset selection
        } else {
            // ❌ If subject cleared, empty chapter list & reset selection
            chapterCombo.dataSource.data([]);
            chapterCombo.value("");
            ClearQuestionGrid(); // optional: clear grid when subject cleared
        }
    }
    //function LoadChaptersCombo(getQuestionSubjectId) {
    //    $("#QuestionChapterId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Name", title: "Name", width: 150 },
    //            { field: "Remarks", title: "Remarks", width: 150 }
    //        ],
    //        filter: "contains",
    //        dataSource:[],
    //        //dataSource: {
    //        //    transport: {
    //        //        read: {
    //        //            url: "/Questions/QuestionChapter/Dropdown?subjectId=" + getQuestionSubjectId,
    //        //            dataType: "json"
    //        //        }
    //        //    }
    //        //},
    //        placeholder: "Select Question Chapter",
    //        change: function (e) {
    //            var getQuestionChapterId = this.value();
    //            if (getQuestionChapterId) {
    //                LoadQuestionGrids(getQuestionChapterId);
    //            }
    //        }
    //    });
    //}
    function ClearQuestionGrid() {
        var grid = $("#kAllQuestions").data("kendoGrid");
        if (grid) {
            grid.dataSource.data([]); // Clear data
        }
    }
    function GetCategoryComboBox() {
        $("#QuestionCategorieId").kendoMultiColumnComboBox({
            dataTextField: "CategoryName",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "CategoryName", title: "Category", width: 150 },
                { field: "Description", title: "Description", width: 150 }
            ],
            filter: "contains",
            dataSource: { transport: { read: "/Common/Common/GetQuestionCategoryList" } },
            placeholder: "Select Category"
        });
    }
    // Initialize editable grid
    var detailsList = JSON.parse($("#detailsListJson").val() || "[]");
    var detailsGridDataSource = new kendo.data.DataSource({
        data: detailsList,
        schema: {
            model: {
                id: "Id",
                fields: {
                    Id: { type: "number", defaultValue: 0 },
                    QuestionText: { type: "string", defaultValue: "" },
                    QuestionMark: { type: "number", defaultValue: null }
                }
            }
        },

    });
    // Initialize editable grid for Added Questions
    function LoadAddedQuestionsGrid() {
        var detailsList = JSON.parse($("#detailsListJson").val() || "[]");

        $("#kAddedQuestions").kendoGrid({
            dataSource: new kendo.data.DataSource({
                data: detailsList, // ✅ Set the existing data here
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            Id: { type: "number", defaultValue: 0 },
                            QuestionText: { type: "string", defaultValue: "" },
                            QuestionMark: { type: "number", defaultValue: null }
                        }
                    }
                }
            }),
            columns: [
                { field: "Id", hidden: true },
                { field: "QuestionText", title: "Question", width: 300 },
                { field: "QuestionMark", title: "Mark", width: 80 },
                {
                    title: "Action",
                    width: 60,
                    template: "<button type='button' class='btn btn-sm btn-danger k-grid-remove-question'><i class='fa fa-trash'></i></button>"
                }
            ],
            noRecords: {
                template: "<div class='text-center p-3'>No questions added yet.</div>"
            },
            dataBound: function () {
                $("#kAddedQuestions .k-grid-remove-question")
                    .off("click")
                    .on("click", function (e) {
                        e.preventDefault();
                        var grid = $("#kAddedQuestions").data("kendoGrid");
                        var dataItem = grid.dataItem($(this).closest("tr"));
                        grid.dataSource.remove(dataItem);
                    });
            }
        });
    }

    // =========================
    // 🔹 Unified Question Grid
    // =========================
    function LoadQuestionGrids(chapterId) {
        var grid = $("#kAllQuestions").data("kendoGrid");

        // ✅ If grid already exists, just refresh its dataSource dynamically
        if (grid) {
            grid.setDataSource(new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/Common/Common/GetAllQuestionsByChapter",
                        type: "POST",
                        dataType: "json"
                    },
                    parameterMap: function (data, type) {
                        data.QuestionchapterId = chapterId;
                        return data;
                    }
                },
                schema: {
                    data: "Items",
                    total: "TotalCount"
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10
            }));

            grid.setOptions({
                toolbar: ["search"],
                search: {
                    fields: ["QuestionText", "QuestionMark"]
                }
            });

            grid.dataSource.read();
            return; 
        }

        $("#kAllQuestions").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/Common/Common/GetAllQuestionsByChapter",
                        type: "POST",
                        dataType: "json"
                    },
                    parameterMap: function (data, type) {
                        data.QuestionchapterId = chapterId;
                        return data;
                    }
                },
                schema: {
                    data: "Items",
                    total: "TotalCount"
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10
            }),
            toolbar: ["search"],
            search: {
                fields: ["QuestionText", "QuestionMark", "DifficultyLevel"]
            },
            selectable: "multiple, row",
            sortable: true,
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            columns: [
                { selectable: true, width: 40 },
                {
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#kAllQuestions").data("kendoGrid");
                        var page = grid.dataSource.page();
                        var pageSize = grid.dataSource.pageSize();
                        var index = grid.dataSource.indexOf(dataItem);
                        return (page - 1) * pageSize + (index + 1);
                    }
                },
                { field: "Id", title: "Id", width: 300, hidden: true },
                { field: "QuestionText", title: "Question", width: 300 },
                { field: "QuestionMark", title: "Mark", width: 80 },
                {
                    title: "Action",
                    width: 60,
                    template: "<button type='button' class='btn btn-sm btn-success k-grid-add-question' title='Add'><i class='fa fa-arrow-right'></i></button>"
                }
            ],
            noRecords: {
                template: "<div class='text-center p-3'>No questions found for this chapter.</div>"
            },
            dataBound: function () {
                
                $("#kAllQuestions .k-grid-add-question").off("click").on("click", function (e) {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    var grid = $("#kAllQuestions").data("kendoGrid");
                    var dataItem = grid.dataItem($(this).closest("tr"));
                    console.log(dataItem);
                    AddQuestionToSet(dataItem);
                });
            }
        });
    }

    $("#btnAddQuestion").click(function (e) {
        
        e.preventDefault();
        var grid = $("#kAllQuestions").data("kendoGrid");
        var selectedRows = grid.select();

        if (!selectedRows || selectedRows.length === 0) {
            ShowNotification(3, "Please select at least one row to add.");
            return;
        }

        var addGrid = $("#kAddedQuestions").data("kendoGrid");
        var addDS = addGrid.dataSource;

        selectedRows.each(function () {
            var dataItem = grid.dataItem(this);

            // prevent duplicate transfer
            var exists = addDS.data().some(i => i.QuestionHeaderId === dataItem.Id);
            if (!exists) {
                // Add a **copy** to prevent reference issues
                addDS.add($.extend({}, dataItem));

                // Disable the row visually
                $(this).addClass("disabled-row").find("td").css("pointer-events", "none");

                // Disable select button in row
                $(this).find(".k-grid-select").prop("disabled", true);
            }
            else
            {
                ShowNotification(2, "Question already added.");
            }
        });
    });

    // ✅ Function: Add Question to "Added" Grid
    function AddQuestionToSet(dataItem) {
        
        var addedGrid = $("#kAddedQuestions").data("kendoGrid");
        if (!addedGrid) {
            $("#kAddedQuestions").kendoGrid({
                dataSource: { data: [] },
                columns: [
                    { field: "QuestionHeaderId", hidden: true },
                    { field: "QuestionText", title: "Question", width: 300 },
                    { field: "QuestionMark", title: "Mark", width: 80 },
                    {
                        title: "Action",
                        width: 60,
                        template: "<button class='btn btn-sm btn-danger k-grid-remove-question'><i class='fa fa-trash'></i></button>"
                    }
                ],
                noRecords: {
                    template: "<div class='text-center p-3'>No questions added yet.</div>"
                },
                dataBound: function () {
                    $("#kAddedQuestions .k-grid-remove-question").off("click").on("click", function (e) {
                        var grid = $("#kAddedQuestions").data("kendoGrid");
                        var dataItem = grid.dataItem($(this).closest("tr"));
                        grid.dataSource.remove(dataItem);
                    });
                }
            });
            addedGrid = $("#kAddedQuestions").data("kendoGrid");
        }

        var ds = addedGrid.dataSource;
        if (ds.data().some(q => q.QuestionHeaderId === dataItem.Id)) {
            ShowNotification(2, "Question already added.");
            return;
        }

        ds.add({
            QuestionHeaderId: dataItem.Id,
            QuestionText: dataItem.QuestionText,
            QuestionMark: dataItem.QuestionMark
        });
    }

    // =========================
    // 🔹 Header Grid (Index)
    // =========================

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
                    url: "/Questions/QuestionSets/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                //    parameterMap: function (options) {
                //        if (options.sort) {
                //            options.sort.forEach(function (param) {
                //                if (param.field === "ID") {
                //                    param.field = "H.Id";
                //                }
                //                if (param.field === "Code") {
                //                    param.field = "H.Code";
                //                }
                //                if (param.field === "Name") {
                //                    param.field = "H.Name";
                //                }
                //                if (param.field === "Description") {
                //                    param.field = "H.Description";
                //                }
                //                if (param.field === "CategoryName") {
                //                    param.field = "C.Name";
                //                }
                //                if (param.field === "Status") {
                //                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                //                    if (statusValue.startsWith("a")) {
                //                        param.value = 1;
                //                    } else if (statusValue.startsWith("i")) {
                //                        param.value = 0;
                //                    } else {
                //                        param.value = null;
                //                    }

                //                    param.field = "H.IsActive";
                //                    param.operator = "eq";
                //                }
                //            });
                //        }

                //        if (options.filter && options.filter.filters) {
                //            options.filter.filters.forEach(function (param) {
                //                if (param.field === "Id") {
                //                    param.field = "H.Id";
                //                }
                //                if (param.field === "Code") {
                //                    param.field = "H.Code";
                //                }
                //                if (param.field === "Name") {
                //                    param.field = "H.Name";
                //                }
                //                if (param.field === "Description") {
                //                    param.field = "H.Description";
                //                }
                //                if (param.field === "CategoryName") {
                //                    param.field = "C.Name";
                //                }
                //                if (param.field === "Status") {
                //                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                //                    if (statusValue.startsWith("a")) {
                //                        param.value = 1;
                //                    } else if (statusValue.startsWith("i")) {
                //                        param.value = 0;
                //                    }
                //                    else {
                //                        param.value = null;
                //                    }

                //                    param.field = "H.IsActive";
                //                    param.operator = "eq";
                //                }
                //            });
                //        }
                //        return options;
                //    }
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
            //search: {
            //    fields: ["Code", "Name", "Description", "Status"]
            //},
            excel: {
                fileName: "Items.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Items_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan Examination System.";

                var fileName = `Items_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                    width: 40,
                    template: function (dataItem) {
                        return `
                            <a href="/Questions/QuestionSets/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", title: "ID", width: 100, hidden: true },
                { field: "Name", title: "Question Set Name", width: 200 },
                { field: "TotalMark", title: "Total Mark", width: 100 },
                { field: "Remarks", title: "Remarks", width: 200 },
                { field: "IsActive", title: "Status", width: 100 }

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
    }

    // =========================
    // 🔹 Details Grid (Edit)
    // =========================

    function LoadDetailGridData(headerId) {
        var ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Exam/QuestionSet/GetQuestionSetDetailDataById",
                    dataType: "json",
                    data: { headerId: headerId }
                }
            },
            schema: { data: "Items", total: "TotalCount" },
            pageSize: 10
        });

        $("#kDetails").kendoGrid({
            dataSource: ds,
            pageable: true,
            editable: "inline",
            toolbar: ["create"],
            columns: [
                {
                    field: "QuestionHeaderId",
                    title: "Question",
                    width: 300,
                    editor: questionComboEditor
                },
                { field: "QuestionMark", title: "Mark", width: 100 },
                {
                    command: [{ name: "destroy", iconClass: "k-icon k-i-trash", text: "" }],
                    title: "&nbsp;", width: 50
                }
            ]
        });
    }

    function questionComboEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                dataTextField: "QuestionText",
                dataValueField: "Id",
                filter: "contains",
                dataSource: { transport: { read: "/Common/Common/GetQuestionList" } },
                placeholder: "Select Question"
            });
    }

    // =========================
    // 🔹 Save & Post
    // =========================

    // Save the form data
    function save() {
        
        var validator = $("#frmEntry").validate();
        if (!validator.form()) {
            validator.focusInvalid();
            return;
        }

        var model = serializeInputs("frmEntry");
        var formData = new FormData();

        var Qdetails = [];
        var grid = $("#kAddedQuestions").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();
            debugger;
            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                // Validate if a Question is selected
                //if (!item.QuestionHeaderId || parseFloat(item.QuestionHeaderId) <= 0) {
                //    ShowNotification(3, "Question is required.");
                //    return;
                //}

                Qdetails.push({
                    //QuestionSetHeaderId: item.Id,
                    QuestionHeaderId: item.Id,
                    QuestionMark: item.QuestionMark
                });
            }
        }

        // Prevent save if no details are added
        if (Qdetails.length === 0) {
            ShowNotification(3, "At least one question entry is required.");
            return;
        }

        model.questionSetDetailList = Qdetails;

        // Append normal properties
        for (var key in model) {
            if (key !== "questionSetDetailList") {
                formData.append(key, model[key]);
            }
        }

        // Append Question detail list
        model.questionSetDetailList.forEach(function (detail, i) {
            for (var key in detail) {
                if (detail.hasOwnProperty(key)) {
                    formData.append(`questionSetDetailList[${i}].${key}`, detail[key]);
                }
            }
        });


        formData.append("IsActive", $('#IsActive').prop('checked'));

        CommonAjaxService.finalImageSave("/Questions/QuestionSets/CreateEdit", formData, saveDone, saveFail);
    }

    //function save() {
    //    var validator = $("#frmEntry").validate();
    //    if (!validator.form()) {
    //        ShowNotification(3, "Please complete required fields.");
    //        return;
    //    }

    //    var model = serializeInputs("frmEntry");
    //    var details = [];
    //    var grid = $("#kDetails").data("kendoGrid");

    //    if (grid) {
    //        grid.saveChanges();
    //        grid.dataSource.data().forEach(item => {
    //            if (item.QuestionHeaderId) {
    //                details.push({
    //                    QuestionHeaderId: item.QuestionHeaderId,
    //                    QuestionMark: item.QuestionMark
    //                });
    //            }
    //        });
    //    }

    //    if (details.length === 0) {
    //        ShowNotification(3, "Please add at least one question.");
    //        return;
    //    }

    //    model.details = details;
    //    CommonAjaxService.finalSave("/Exam/QuestionSet/CreateEdit", model, saveDone, saveFail);
    //}

    function saveDone(result) {
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            if (result.Data.Operation == "add") {
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
            }
        } else {
            ShowNotification(2, result.Message);
        }
    }

    function saveFail() {
        ShowNotification(3, "Save failed!");
    }

    function postDone(result) {
        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) grid.dataSource.read();

        if (result.Status == 200)
            ShowNotification(1, result.Message);
        else
            ShowNotification(2, result.Message);
    }

    function fail() {
        ShowNotification(3, "Something went wrong.");
    }

    function GenerateDatePicker() {
        $("#FromDate").kendoDatePicker({ format: "yyyy-MM-dd" });
        $("#ToDate").kendoDatePicker({ format: "yyyy-MM-dd" });
    }

    return { init: init };

})(CommonService, CommonAjaxService);

// ✅ Print Preview
document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector(".sslPrintC");
    if (container) {
        var id = container.getAttribute("data-id");
        if (id) {
            var btn = document.createElement("a");
            btn.href = "#";
            btn.style.backgroundColor = "skyblue";
            btn.className = "btn btn-success btn-sm mr-2 edit";
            btn.title = "Report Preview";
            btn.innerHTML = "<i class='fas fa-print'></i>";
            btn.onclick = function (e) {
                e.preventDefault();
                ReportPreview(id);
            };
            container.appendChild(btn);
        }
    }
});

function ReportPreview(id) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/Exam/QuestionSet/ReportPreview';
    form.target = '_blank';
    const inputVal = document.createElement('input');
    inputVal.type = 'hidden';
    inputVal.name = 'Id';
    inputVal.value = id;
    form.appendChild(inputVal);
    document.body.appendChild(form);
    form.submit();
    form.remove();
}



//var QuestionSetsController = function (CommonService, CommonAjaxService) {

//    var init = function () {

//        // Get hidden values from page
//        var getId = $("#Id").val() || 0;
//        var getOperation = $("#Operation").val() || '';
//        var getBranchId = $("#BranchId").val() || 0;
//        getQuestionSubjectId = $("#QuestionSubjectId").val() || 0;
//        getQuestionChapterId = $("#QuestionChapterId").val() || 0;

//        // Default grid initialization (index page)
//        if (parseInt(getId) == 0 && getOperation == '') {
//            GetGridDataList();
//            GenerateDatePicker();
//        };

//        // If in create/edit mode
//        if (getOperation !== '') {
//            
//            GetQuestionSubjectComboBox();
//            LoadChaptersBySubject(getQuestionSubjectId);
//            GetCategoryComboBox();
//            GetQuestionComboBox();
//            LoadQuestionGrids(getQuestionChapterId);
//            LoadDetailGridData(getId);
//        }

//        // If editing existing record
//        if (getOperation == "update") {
//            LoadDetailGridData(getId);
//            LoadQuestionGrids(getQuestionChapterId);
//        }

//        // ✅ Save button
//        $('.btnsave').click('click', function () {
//            var getId = $('#Id').val();
//            var status = "Save";
//            if (parseInt(getId) > 0) {
//                status = "Update";
//            }
//            Confirmation("Are you sure? Do You Want to " + status + " Data?",
//                function (result) {
//                    if (result) {
//                        save();
//                    }
//                });
//        });

//        // ✅ Post button
//        $('.btnPost').on('click', function () {
//            Confirmation("Are you sure? Do You Want to Post Data?",
//                function (result) {
//                    if (result) {
//                        var model = serializeInputs("frmEntry");
//                        if (model.IsPost == "True") {
//                            ShowNotification(3, "Data has already been Posted.");
//                        } else {
//                            model.IDs = model.Id;
//                            var url = "/Exam/QuestionSet/MultiplePost";
//                            CommonAjaxService.multiplePost(url, model, postDone, fail);
//                        }
//                    }
//                });
//        });

//        // ✅ Next/Previous buttons
//        $('#btnPrevious').click('click', function () {
//            var getId = $('#Id').val();
//            if (parseInt(getId) > 0) {
//                window.location.href = "/Exam/QuestionSet/NextPrevious?id=" + getId + "&status=Previous";
//            }
//        });

//        $('#btnNext').click('click', function () {
//            var getId = $('#Id').val();
//            if (parseInt(getId) > 0) {
//                window.location.href = "/Exam/QuestionSet/NextPrevious?id=" + getId + "&status=Next";
//            }
//        });

//        // ✅ Filter/Search button
//        $("#indexSearch").on('click', function () {
//            var branchId = $("#Branchs").data("kendoMultiColumnComboBox").value();

//            if (branchId == "") {
//                ShowNotification(3, "Please Select Branch Name First!");
//                return;
//            }
//            const gridElement = $("#GridDataList");
//            if (gridElement.data("kendoGrid")) {
//                gridElement.data("kendoGrid").destroy();
//                gridElement.empty();
//            }
//            GetGridDataList();
//        });
//        // ✅ Load Question Subject Dropdown
//        function GetQuestionSubjectComboBox() {
//            
//            $("#QuestionSubjectId").kendoMultiColumnComboBox({
//                dataTextField: "Name",
//                dataValueField: "Id",
//                height: 400,
//                columns: [
//                    { field: "Name", title: "Name", width: 150 },
//                    { field: "Remarks", title: "Remarks", width: 150 }
//                ],
//                filter: "contains",
//                filterFields: ["Name", "Remarks"],
//                dataSource: {
//                    transport: {
//                        read: {
//                            url: "/Questions/QuestionSubject/Dropdown",
//                            dataType: "json"
//                        }
//                    }
//                },
//                placeholder: "Select Question Subject",
//                change: function (e) {
//                    
//                    const subjectId = this.value();
//                    if (subjectId && subjectId !== "0") {
//                        LoadChaptersBySubject(subjectId);
//                    } else {
//                        // Clear chapter combo if subject is cleared
//                        const chapterCombo = $("#QuestionChapterId").data("kendoMultiColumnComboBox");
//                        if (chapterCombo) {
//                            chapterCombo.value("");
//                            chapterCombo.setDataSource(new kendo.data.DataSource({ data: [] }));
//                        }
//                    }
//                }
//            });
//        }


//        // ✅ Load Chapter Dropdown based on Subject
//        function LoadChaptersBySubject(subjectId) {
//            
//            const combo = $("#QuestionChapterId").data("kendoMultiColumnComboBox");

//            if (combo) {
//                // If already initialized, just update its dataSource dynamically
//                combo.setDataSource(new kendo.data.DataSource({
//                    transport: {
//                        read: {
//                            url: "/Questions/QuestionChapter/Dropdown?subjectId=" + subjectId,
//                            dataType: "json"
//                        }
//                    }
//                }));
//                combo.value("");
//            } else {
//                // Initialize for first time
//                $("#QuestionChapterId").kendoMultiColumnComboBox({
//                    dataTextField: "Name",
//                    dataValueField: "Id",
//                    height: 400,
//                    columns: [
//                        { field: "Name", title: "Name", width: 150 },
//                        { field: "Remarks", title: "Remarks", width: 150 }
//                    ],
//                    filter: "contains",
//                    filterFields: ["Name", "Remarks"],
//                    dataSource: {
//                        transport: {
//                            read: {
//                                url: "/Questions/QuestionChapter/Dropdown?subjectId=" + subjectId,
//                                dataType: "json"
//                            }
//                        }
//                    },
//                    placeholder: "Select Question Chapter",
//                    change: function () {
//                        
//                        const chapterId = this.value();
//                        if (chapterId && chapterId !== "0") {
//                            LoadQuestionGrids(chapterId);
//                        }
//                    }
//                });
//            }
//        }


//        // ✅ Load Question Grids based on Chapter
//        function LoadQuestionGrids(chapterId) {
//            
//            // 🔹 Grid for All Questions
//            $("#kAllQuestions").kendoGrid({
//                dataSource: {
//                    transport: {
//                        read: {
//                            url: "/Common/Common/GetAllQuestionsByChapter?chapterId=" + chapterId,
//                            dataType: "json"
//                        }
//                    },
//                    pageSize: 10
//                },
//                pageable: true,
//                sortable: true,
//                filterable: true,
//                columns: [
//                    { field: "Id", hidden: true },
//                    { field: "QuestionText", title: "Question", width: 300 },
//                    { field: "QuestionMark", title: "Mark", width: 80 },
//                    {
//                        command: [{ text: "", iconClass: "k-icon k-i-arrow-right", click: AddQuestionToSet }],
//                        title: "Action", width: 60
//                    }
//                ]
//            });

//            // 🔹 Grid for Added Questions (Initially Empty)
//            if (!$("#kAddedQuestions").data("kendoGrid")) {
//                $("#kAddedQuestions").kendoGrid({
//                    dataSource: { data: [] },
//                    columns: [
//                        { field: "QuestionText", title: "Question", width: 300 },
//                        { field: "QuestionMark", title: "Mark", width: 80 },
//                        {
//                            command: [{ text: "", iconClass: "k-icon k-i-trash", click: RemoveQuestion }],
//                            title: "Action", width: 60
//                        }
//                    ]
//                });
//            }
//        }


//        // ✅ Add Question to Added Grid
//        function AddQuestionToSet(e) {
//            e.preventDefault();
//            const grid = $("#kAllQuestions").data("kendoGrid");
//            const selectedItem = grid.dataItem($(e.currentTarget).closest("tr"));
//            const addedGrid = $("#kAddedQuestions").data("kendoGrid");
//            const data = addedGrid.dataSource.data();

//            // Prevent duplicate questions
//            if (data.some(q => q.Id === selectedItem.Id)) {
//                ShowNotification(2, "This question is already added.");
//                return;
//            }

//            data.push({
//                Id: selectedItem.Id,
//                QuestionText: selectedItem.QuestionText,
//                QuestionMark: selectedItem.QuestionMark
//            });

//            addedGrid.refresh();
//        }


//        // ✅ Remove Question from Added Grid
//        function RemoveQuestion(e) {
//            e.preventDefault();
//            const grid = $("#kAddedQuestions").data("kendoGrid");
//            const dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
//            grid.dataSource.remove(dataItem);
//        }
//        function AddQuestionToSet(e) {
//            e.preventDefault();
//            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
//            var addedGrid = $("#kAddedQuestions").data("kendoGrid");
//            var data = addedGrid.dataSource.data();

//            // prevent duplicates
//            if (!data.some(q => q.Id === dataItem.Id)) {
//                addedGrid.dataSource.add(dataItem);
//            } else {
//                ShowNotification(2, "Question already added.");
//            }
//        }

//        function RemoveQuestion(e) {
//            e.preventDefault();
//            var grid = $("#kAddedQuestions").data("kendoGrid");
//            grid.removeRow($(e.currentTarget).closest("tr"));
//        }
//    };

//    // =========================
//    // 🔹 SUPPORTING FUNCTIONS
//    // =========================

//    //function GetBranchList() {
//    //    CommonComboHelper.bindBranchComboBox("#Branchs");
//    //};

//    function GenerateDatePicker() {
//        $("#FromDate").kendoDatePicker({ format: "yyyy-MM-dd" });
//        $("#ToDate").kendoDatePicker({ format: "yyyy-MM-dd" });
//    }


//    function GetCategoryComboBox() {
//        $("#QuestionCategorieId").kendoMultiColumnComboBox({
//            dataTextField: "CategoryName",
//            dataValueField: "Id",
//            height: 400,
//            columns: [
//                { field: "CategoryName", title: "Category", width: 150 },
//                { field: "Description", title: "Description", width: 150 }
//            ],
//            filter: "contains",
//            dataSource: { transport: { read: "/Common/Common/GetQuestionCategoryList" } },
//            placeholder: "Select Category"
//        });
//    }

//    function GetQuestionComboBox() {
//        $("#QuestionHeaderId").kendoMultiColumnComboBox({
//            dataTextField: "QuestionText",
//            dataValueField: "Id",
//            height: 400,
//            columns: [
//                { field: "QuestionText", title: "Question", width: 300 },
//                { field: "QuestionMark", title: "Mark", width: 100 }
//            ],
//            filter: "contains",
//            dataSource: { transport: { read: "/Common/Common/GetQuestionList" } },
//            placeholder: "Select Question"
//        });
//    }

//    // =========================
//    // 🔹 GRID AND DATA LOADERS
//    // =========================

//    function GetGridDataList() {
//        var FromDate = $('#FromDate').val();
//        var ToDate = $('#ToDate').val();

//        var gridDataSource = new kendo.data.DataSource({
//            type: "json",
//            serverPaging: true,
//            serverSorting: true,
//            serverFiltering: true,
//            pageSize: 10,
//            transport: {
//                read: {
//                    url: "/Exam/QuestionSet/GetGridData",
//                    type: "POST",
//                    dataType: "json",
//                    data: { fromDate: FromDate, toDate: ToDate }
//                },
//                parameterMap: function (options) {
//                    return options;
//                }
//            },
//            schema: {
//                data: "Items",
//                total: "TotalCount"
//            }
//        });

//        $("#GridDataList").kendoGrid({
//            dataSource: gridDataSource,
//            pageable: {
//                refresh: true,
//                pageSizes: [10, 20, 50, "all"]
//            },
//            sortable: true,
//            filterable: true,
//            toolbar: ["excel", "pdf", "search"],
//            search: ["Name", "Remarks", "TotalMark"],
//            columns: [
//                {
//                    title: "Action",
//                    width: 80,
//                    template: function (dataItem) {
//                        return `
//                            <a href="/Exam/QuestionSet/Edit/${dataItem.Id}" class="btn btn-primary btn-sm">
//                                <i class="fas fa-pencil-alt"></i>
//                            </a>
//                            <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm'>
//                                <i class='fas fa-print'></i>
//                            </a>`;
//                    }
//                },
//                { field: "Id", hidden: true },
//                { field: "Name", title: "Set Name", width: 200 },
//                { field: "TotalMark", title: "Total Mark", width: 100 },
//                { field: "Remarks", title: "Remarks", width: 200 },
//                { field: "IsActive", title: "Active", width: 80, template: "#= IsActive ? 'Yes' : 'No' #" },
//                { field: "IsArchive", title: "Archive", width: 80, template: "#= IsArchive ? 'Yes' : 'No' #" }
//            ]
//        });
//    }

//    function LoadDetailGridData(masterId) {
//        var dataSource = new kendo.data.DataSource({
//            transport: {
//                read: {
//                    url: "/Exam/QuestionSet/GetQuestionSetDetailDataById",
//                    type: "GET",
//                    dataType: "json",
//                    data: { headerId: masterId }
//                }
//            },
//            schema: { data: "Items", total: "TotalCount" },
//            pageSize: 10
//        });

//        $("#kDetails").kendoGrid({
//            dataSource: dataSource,
//            pageable: true,
//            toolbar: ["create"],
//            editable: true,
//            columns: [
//                { field: "QuestionHeaderId", title: "Question", width: 300 },
//                { field: "QuestionMark", title: "Mark", width: 100 },
//                {
//                    command: [
//                        { name: "destroy", iconClass: "k-icon k-i-trash", text: "" }
//                    ],
//                    title: "&nbsp;", width: 50
//                }
//            ]
//        });
//    }

//    // =========================
//    // 🔹 CRUD + POST LOGIC
//    // =========================

//    function save() {
//        var validator = $("#frmEntry").validate();
//        var model = serializeInputs("frmEntry");
//        var result = validator.form();

//        if (!result) {
//            ShowNotification(3, "Please complete required fields.");
//            return;
//        }

//        var details = [];
//        var grid = $("#kDetails").data("kendoGrid");
//        if (grid) {
//            grid.saveChanges();
//            var dataItems = grid.dataSource.data();
//            for (var i = 0; i < dataItems.length; i++) {
//                var item = dataItems[i];
//                details.push({
//                    QuestionHeaderId: item.QuestionHeaderId,
//                    QuestionMark: item.QuestionMark
//                });
//            }
//        }
//        model.details = details;

//        var url = "/Exam/QuestionSet/CreateEdit";
//        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
//    }

//    function saveDone(result) {
//        if (result.Status == 200) {
//            ShowNotification(1, result.Message);
//            if (result.Data.Operation == "add") {
//                $("#Id").val(result.Data.Id);
//                $("#Operation").val("update");
//            }
//        } else {
//            ShowNotification(2, result.Message);
//        }
//    }

//    function saveFail(result) {
//        ShowNotification(3, "Save failed!");
//    }

//    function postDone(result) {
//        var grid = $('#GridDataList').data('kendoGrid');
//        if (grid) grid.dataSource.read();

//        if (result.Status == 200)
//            ShowNotification(1, result.Message);
//        else
//            ShowNotification(2, result.Message);
//    }

//    function fail(err) {
//        ShowNotification(3, "Something went wrong.");
//    }

//    return { init: init };
//}(CommonService, CommonAjaxService);


//// ✅ Print Preview
//document.addEventListener("DOMContentLoaded", function () {
//    var container = document.querySelector(".sslPrintC");
//    if (container) {
//        var id = container.getAttribute("data-id");
//        if (id) {
//            var btn = document.createElement("a");
//            btn.href = "#";
//            btn.style.backgroundColor = "skyblue";
//            btn.className = "btn btn-success btn-sm mr-2 edit";
//            btn.title = "Report Preview";
//            btn.innerHTML = "<i class='fas fa-print'></i>";
//            btn.onclick = function (e) {
//                e.preventDefault();
//                ReportPreview(id);
//            };
//            container.appendChild(btn);
//        }
//    }
//});

//function ReportPreview(id) {
//    const form = document.createElement('form');
//    form.method = 'post';
//    form.action = '/Exam/QuestionSet/ReportPreview';
//    form.target = '_blank';
//    const inputVal = document.createElement('input');
//    inputVal.type = 'hidden';
//    inputVal.name = 'Id';
//    inputVal.value = id;
//    form.appendChild(inputVal);
//    document.body.appendChild(form);
//    form.submit();
//    form.remove();
//}
