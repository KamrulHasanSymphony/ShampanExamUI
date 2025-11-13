var GradeController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        // Initialize the grade details grid
        var $table = $('#gradeDetails');
        var table = initEditTable($table, { searchHandleAfterEdit: false });

        var gradeDetails = JSON.parse($("#GradeDetailsJson").val() || "[]");

        var gradeDetailsGrid = new kendo.data.DataSource({
            data: gradeDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        Grade: { type: "string", defaultValue: "" },
                        MinPercentage: { type: "string", defaultValue: "" },
                        MaxPercentage: { type: "string", defaultValue: "" },
                        GradePoint: { type: "string", defaultValue: "" },
                        GradePointNote: { type: "string", defaultValue: "" },
                        SL: { type: "number", defaultValue: 0 },
                        SLNo: { type: "number", defaultValue: 0 }
                    }
                }
            }
        });

        var rowNumber = 0;
        $("#gradeDetails").kendoGrid({
            dataSource: gradeDetailsGrid,
            toolbar: [{ name: "create", text: "Add" }],
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
                        var grid = $("#gradeDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "Grade",
                    title: "Grade Name",
                    //editor: gradeSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.Grade || "";
                    },
                    width: 150
                },
                { field: "MinPercentage", title: "Min Percentage", width: 100 },
                { field: "MaxPercentage", title: "Max Percentage", width: 100 },
                { field: "GradePoint", title: "Grade Point", width: 100 },
                { field: "GradePointNote", title: "Grade Point Note", width: 150 },
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
                        url: "/Questions/Grade/GetGridData",
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
                                if (param.field === "Description") {
                                    param.field = "H.Description";
                                }
                                if (param.field === "CategoryName") {
                                    param.field = "C.Name";
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
                                if (param.field === "Code") {
                                    param.field = "H.Code";
                                }
                                if (param.field === "Name") {
                                    param.field = "H.Name";
                                }
                                if (param.field === "Description") {
                                    param.field = "H.Description";
                                }
                                if (param.field === "CategoryName") {
                                    param.field = "C.Name";
                                }
                                if (param.field === "Status") {
                                    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                    if (statusValue.startsWith("a")) {
                                        param.value = 1;
                                    } else if (statusValue.startsWith("i")) {
                                        param.value = 0;
                                    }
                                    else {
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
                search: {
                    fields: ["Code", "Name", "Description", "Status"]
                },
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
                            <a href="/Questions/Grade/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                        }
                    },
                    { field: "Id", title: "ID", width: 100, hidden: true },
                    { field: "Name", title: "Grade Name", width: 200 },
                    { field: "Code", title: "Grade Code", width: 150 },
                    { field: "IsActive", title: "Status", width: 100 }
                ],
                editable: false,
                selectable: "multiple row",
                navigatable: true,
                columnMenu: true
            });
        }



        // Save the form data
        function save($table) {
            
            var validator = $("#frmEntry").validate();
            if (!validator.form()) {
                validator.focusInvalid();
                return;
            }

            var model = serializeInputs("frmEntry");
            var formData = new FormData();

            var Gdetails = [];
            var grid = $("#gradeDetails").data("kendoGrid");
            if (grid) {
                var dataItems = grid.dataSource.view();

                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];

                    //// Validate if Grade is selected
                    //if (!item.GradeId || parseFloat(item.GradeId) <= 0) {
                    //    ShowNotification(3, "Grade is required.");
                    //    return;
                    //}

                    Gdetails.push({
                        Grade: item.Grade,
                        MinPercentage: item.MinPercentage,
                        MaxPercentage: item.MaxPercentage,
                        GradePoint: item.GradePoint,
                        GradePointNote: item.GradePointNote,
                        IsActive: item.IsActive
                    });
                }
            }

            // Prevent save if no details are added
            if (Gdetails.length === 0) {
                ShowNotification(3, "At least one grade entry is required.");
                return;
            }

            model.gradeDetailList = Gdetails;

            // Append normal properties
            for (var key in model) {
                if (key !== "gradeDetailList") {
                    formData.append(key, model[key]);
                }
            }

            // Append Grade detail list
            model.gradeDetailList.forEach(function (detail, i) {
                for (var key in detail) {
                    if (detail.hasOwnProperty(key)) {
                        formData.append(`gradeDetailList[${i}].${key}`, detail[key]);
                    }
                }
            });


            formData.append("IsActive", $('#IsActive').prop('checked'));

            CommonAjaxService.finalImageSave("/Questions/Grade/CreateEdit", formData, saveDone, saveFail);
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
