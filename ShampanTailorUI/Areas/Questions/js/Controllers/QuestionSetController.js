var QuestionSetController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getQuestionSubjectId = $("#QuestionSubjectId").val() || 0;
        var getQuestionChapterId = $("#QuestionChapterId").val() || 0;

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        GetQuestionSubjectComboBox();
        GetQuestionChapterComboBox();
        LoadQuestionsBySubjectChapter();
  

        function GetQuestionSubjectComboBox() {
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
                change: function (e) {
                    var subjectId = this.value();
                    if (subjectId) {
                        LoadChaptersBySubject(subjectId);
                    }
                }
            }).data("kendoMultiColumnComboBox");
        }
        function LoadChaptersBySubject(subjectId) {
            debugger;
            var chapterDropdown = $("#QuestionChapterId").data("kendoMultiColumnComboBox");
            if (chapterDropdown) {
                chapterDropdown.setDataSource(new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/Questions/QuestionChapter/GetChapterBySubjectId?subjectId=" + subjectId,
                            dataType: "json"
                        }
                    }
                }));
                chapterDropdown.value("");
            }
        }
        function LoadChaptersBySubject(subjectId) {
            var chapterDropdown = $("#QuestionChapterId").data("kendoMultiColumnComboBox");
            if (chapterDropdown) {
                chapterDropdown.setDataSource(new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/Questions/QuestionChapter/GetChapterBySubjectId?subjectId=" + subjectId,
                            dataType: "json"
                        }
                    }
                }));
                chapterDropdown.value(""); // Clear previously selected value
            }
        }

        function GetQuestionChapterComboBox() {
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
                change: function (e) {
                    var subjectId = $("#QuestionSubjectId").val();
                    var chapterId = this.value();
                    if (subjectId && chapterId) {
                        LoadQuestionsBySubjectChapter(subjectId, chapterId);
                    }
                }
            }).data("kendoMultiColumnComboBox");
        }

        function LoadQuestionsBySubjectChapter(subjectId, chapterId) {

            var SupplierComboBox = $("#FromShedId").kendoMultiColumnComboBox({
                dataTextField: "ShedName",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Code", title: "Code", width: 100 },
                    { field: "ShedName", title: "ShedName", width: 150 },
                    { field: "Condition", title: "Condition", width: 150 },

                ],
                filter: "contains",
                filterFields: ["Code", "ShedName"],
                dataSource: {
                    transport: {

                        read: {
                            url: '/Questions/QuestionHeader/Dropdown',
                            data: {
                                subjectId: subjectId, chapterId: chapterId
                            },
                            dataType: "json",
                            success: function (res) {
                                console.log("Success response:", res);
                                if (Array.isArray(res)) {
                                    res.forEach(function (item) {
                                        console.log("Item:", item); // Log each item to verify
                                    });
                                } else {
                                    console.error("Response is not an array:", res);
                                }
                            }

                        }
                    }
                },
                placeholder: "change Shed", 
                value: "",
                dataBound: function (e) {
                    if (getFromShedId) {
                        this.value(parseInt(getFromShedId));
                    }
                    else {
                        this.value();
                    }
                },
                select: function (e) {
                    var dataItem = this.dataItem(e.item);
                    if (dataItem && dataItem.Id) {
                        LoadFromShedGrid(dataItem.Id);
                    }
                }
            }).data("kendoMultiColumnComboBox");
        }

        $("#gridFromShed").on("click", "tr", function (e) {
            const grid = $("#gridFromShed").data("kendoGrid");
            ;
            selectedFromRow = grid.dataItem(this);
            e.preventDefault();
        });

        $("#gridToShed").on("click", ".k-grid-select", function (e) {
            e.preventDefault();

            if (!confirm("Are you sure you want to replace it here?")) {
                return;
            }
            const toGrid = $("#gridToShed").data("kendoGrid");
            const toItem = toGrid.dataItem($(this).closest("tr")); // keep this

            tofarmId = toItem.FarmId;

            if (!selectedFromRow) {
                alert("Please select a row from 'From Shed' grid first.");
            }
            else {

                // ✅ Check if the chamber is already occupied
                if (toItem.TagNumber && toItem.TagNumber.trim() !== "") {
                    alert("Chamber is not empty.");
                }
                else {
                    // Replace data in ToGrid (except chamber)
                    toItem.set("CattleId", selectedFromRow.CattleId);
                    toItem.set("Code", selectedFromRow.Code);
                    toItem.set("TagNumber", selectedFromRow.TagNumber);
                    toItem.set("Gender", selectedFromRow.Gender);
                    toItem.set("Age", selectedFromRow.Age);

                    // Disable FromGrid row
                    const fromRow = $("#gridFromShed tr").filter(function () {
                        return $("#gridFromShed").data("kendoGrid").dataItem(this).uid === selectedFromRow.uid;
                    });
                    fromRow.addClass("disabled-row").find("td").css("pointer-events", "none");
                    const toRow = toGrid.table.find("tr[data-uid='" + toItem.uid + "']"); // updated line
                    toRow.addClass("green-row");
                    // Add to history grid
                    const historyGrid = $("#shedHistoryGrid").data("kendoGrid");
                    const historyItem = {
                        CattleId: selectedFromRow.CattleId,
                        ShedName: toItem.ShedName,
                        ShedChemberId: toItem.ShedChemberId,
                        TagNumber: selectedFromRow.TagNumber,
                        Gender: selectedFromRow.Gender,
                        Age: selectedFromRow.Age,
                        FromFarmId: selectedFromRow.FarmId || 0,
                        ToFarmId: toItem.FarmId || 0,
                        FromShedId: selectedFromRow.ShedId,
                        ToShedId: toItem.ShedId,
                        FromChemberId: selectedFromRow.ShedChemberId,
                        ToChemberId: toItem.ShedChemberId,
                        Reason: ""
                    };

                    historyGrid.dataSource.add(historyItem);
                    historyGrid.refresh();

                    selectedFromRow = null;
                }

            }

        });

        var $table = $('#questionDetails');
        var table = initEditTable($table, { searchHandleAfterEdit: false });

        

        // Initialize editable grid
        function questionSelectorEditor(container, options) {
            debugger;
            var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

            // Create input (you can bind value if needed)
            $('<input type="text" class="form-control" readonly />')
                .attr("data-bind", "value:QuestionText")
                .appendTo(wrapper);

            openQuestionModal(options.model);

            kendo.bind(container, options.model);
        }

        var selectedQuestionGridModel = null;
        function openQuestionModal(gridModel) {
            selectedQuestionGridModel = gridModel;

            $("#questionDetailsWindow").kendoWindow({
                title: "Select Question",
                modal: true,
                width: "900px",
                height: "550px",
                visible: false,
                close: function () {
                    selectedQuestionGridModel = null;
                }
            }).data("kendoWindow").center().open();

            $("#questionDetailsGrid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: "/Common/Common/GetQuestionDataForSet",
                            dataType: "json"
                        }
                    },
                    pageSize: 10
                },
                pageable: true,
                filterable: true,
                selectable: "row",
                toolbar: ["search"],
                searchable: true,
                columns: [
                    { field: "Id", hidden: true },
                    { field: "QuestionSubjectId", title: "QuestionSubjectId", width: '10%' , hidden: true},
                    { field: "QuestionChapterId", title: "QuestionChapterId", width: '15%', hidden: true },
                    { field: "QuestionCategorieId", title: "QuestionCategorieId", width: '15%', hidden: true },
                    { field: "QuestionText", title: "QuestionText", width: '8%' },
                    { field: "QuestionType", title: "QuestionType", width: '8%' },
                    { field: "QuestionMark", title: "QuestionMark", width: '8%' }
                ],
                dataBound: function () {
                    this.tbody.find("tr").on("dblclick", function () {
                        var grid = $("#questionDetailsGrid").data("kendoGrid");
                        var dataItem = grid.dataItem(this);

                        if (dataItem && selectedQuestionGridModel) {
                            selectedQuestionGridModel.set("QuestionHeaderId", dataItem.Id);
                            selectedQuestionGridModel.set("QuestionSubjectId", dataItem.QuestionSubjectId);
                            selectedQuestionGridModel.set("QuestionChapterId", dataItem.QuestionChapterId);
                            selectedQuestionGridModel.set("QuestionCategorieId", dataItem.QuestionCategorieId);
                            selectedQuestionGridModel.set("QuestionText", dataItem.QuestionText || "");
                            selectedQuestionGridModel.set("QuestionType", dataItem.QuestionType || "");
                            selectedQuestionGridModel.set("QuestionMark", dataItem.QuestionMark);

                            var window = $("#questionDetailsWindow").data("kendoWindow");
                            if (window) window.close();
                        }
                    });
                }
            });
        }

        var questionSetDetails = JSON.parse($("#QuestionDetailsJson").val() || "[]");
        var questionDetails = new kendo.data.DataSource({
            data: questionSetDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {

                        QuestionHeaderId: { type: "number", defaultValue: 0 },
                        QuestionSubjectId: { type: "number", defaultValue: 0 },
                        QuestionChapterId: { type: "number", defaultValue: 0 },
                        QuestionCategorieId: { type: "number", defaultValue: 0 },
                        QuestionText: { type: "string", defaultValue: "" },
                        QuestionType: { type: "string", defaultValue: "" },
                        QuestionMark: { type: "number", defaultValue: 0 },
                        SLNO: { type: "number",editable:false }
                    }
                }
            }
        });

        var rowNumber = 0;
        $("#questionDetails").kendoGrid({
            dataSource: questionDetails,
            toolbar: [{ name: "create", text: "Add" }],
            editable: true,
            save: function (e) {
                const grid = this;
                setTimeout(function () {
                    grid.dataSource.aggregate();
                    grid.refresh();
                }, 0);
            },
            columns: [
                {
                    //field:SLNO,
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#questionDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    },
                    editable: false
                },
                {
                    field: "QuestionSubjectId",
                    title: "QuestionSubjectId",
                    template: function (dataItem) {
                        return dataItem.QuestionSubjectId || "";
                    },
                    width: 150
                },
                {
                    field: "QuestionChapterId",
                    title: "QuestionChapterId",
                    template: function (dataItem) {
                        return dataItem.QuestionChapterId || "";
                    },
                    width: 150
                },
                {
                    field: "QuestionCategorieId",
                    title: "QuestionCategorieId",
                    template: function (dataItem) {
                        return dataItem.QuestionCategorieId || "";
                    },
                    width: 150
                },
                {
                    field: "QuestionText",
                    title: "Question Name",
                    editor: questionSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.QuestionText || "";
                    },
                    width: 150
                },
                {
                    field: "QuestionHeaderId",
                    title: "QuestionHeaderId",
                    template: function (dataItem) {
                        return dataItem.QuestionHeaderId || "";
                    },
                    hidden: true
                },
                {
                    field: "QuestionType",
                    title: "Question Type",
                    template: function (dataItem) {
                        return dataItem.QuestionType || "";
                    },
                    width: 100
                },
                {
                    field: "QuestionMark",
                    title: "Question Mark",
                    template: function (dataItem) {
                        return dataItem.QuestionMark || "";
                    },
                    width: 100
                },
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
        $('.btnsave').click('click', function () {
            debugger;
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        //    save($table);
                        save($table);
                    }
                });
        });

        // Delete button click handler
        $('.btnDelete').on('click', function () {
            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    if (result) {
                        SelectData();
                    }
                });
        });

        // Previous button click handler
        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/Exams/Item/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        // Next button click handler
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/Exams/Item/NextPrevious?id=" + getId + "&status=Next";
            }
        });


        // Handle file input change to preview image
        $("#imageUpload").on("change", function (event) {
            $("#imageUpload").prop("disabled", true);
            var file = event.target.files[0];

            if (!file) {
                console.error("No file selected!");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                console.log("File loaded successfully!"); // Debugging

                // Update the preview image and make it visible
                $("#imagePreview").attr("src", e.target.result).show();
                $("#deleteImageBtn").show();
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        });

        // Delete image button handler
        $("#deleteImageBtn").on("click", function () {
            $(this).addClass("clicked");
            $("#imagePreview").attr("src", "").hide(); // Hide preview
            $("#Image").val(""); // Clear hidden field
            $("#deleteImageBtn").hide();
            $("#imageUpload").val(""); // Hide delete button
            $("#imageUpload").prop("disabled", false);
        });

        // Fetch grid data for the list
        function GetGridDataList() {
            debugger;
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
                        url: "/Questions/QuestionSet/GetGridData",
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
                            <a href="/Questions/QuestionSet/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                        }
                    },
                    { field: "Id", title: "ID", width: 100 ,hidden: true},
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

            var Qdetails = [];
            var grid = $("#questionDetails").data("kendoGrid");
            if (grid) {
                var dataItems = grid.dataSource.view();

                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];

                    // Validate if a Question is selected
                    if (!item.QuestionHeaderId || parseFloat(item.QuestionHeaderId) <= 0) {
                        ShowNotification(3, "Question is required.");
                        return;
                    }

                    Qdetails.push({
                        QuestionSetHeaderId: item.Id,
                        QuestionHeaderId: item.QuestionHeaderId,
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

            CommonAjaxService.finalImageSave("/Questions/QuestionSet/CreateEdit", formData, saveDone, saveFail);
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
        }
    };

    


    return {
        init: init
    }
}(CommonService, CommonAjaxService);
