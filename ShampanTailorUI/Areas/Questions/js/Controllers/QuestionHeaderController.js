var QuestionHeaderController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getCategoryId = $("#CategoryId").val() || 0;

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        // GetComboBoxes
        GetQuestionCategoryComboBox();
        GetQuestionTypeComboBox();

        var $table = $('#options');
        var $tableShort = $('#shortdetails');

        var table = initEditTable($table, { searchHandleAfterEdit: false });
        var tableShort = initEditTable($tableShort, { searchHandleAfterEdit: false });

        $('#addOptionRows').on('click', function (e) {
            addRowAdvance($table);
        });

        $('#addShortRows').on('click', function (e) {
            addRowAdvance($tableShort);
        });

        // Initialize editable grid for Question Option Details
        function optionSelectorEditor(container, options) {
            var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);
            $('<input type="text" class="form-control" readonly />')
                .attr("data-bind", "value:OptionName")
                .appendTo(wrapper);

            $('<div class="input-group-append">')
                .append(
                    $('<button class="btn btn-outline-secondary" type="button">')
                        .append('<i class="fa fa-search"></i>')
                        .on("click", function () {
                            openOptionModal(options.model);
                        })
                )
                .appendTo(wrapper);

            kendo.bind(container, options.model);
        }

        var selectedOptionGridModel = null;
        function openOptionModal(gridModel) {
            selectedOptionGridModel = gridModel;

            $("#optionDetailsWindow").kendoWindow({
                title: "Select Option",
                modal: true,
                width: "900px",
                height: "550px",
                visible: false,
                close: function () {
                    selectedOptionGridModel = null;
                }
            }).data("kendoWindow").center().open();

            $("#optionDetailsGrid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: "/Common/Common/GetQuestionOptionDataForQuestion",
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
                    { field: "Code", title: "Option Code", width: '10%' },
                    { field: "Name", title: "Option Name", width: '15%' },
                    { field: "IsActive", title: "Active", width: '8%' }
                ],
                dataBound: function () {
                    this.tbody.find("tr").on("dblclick", function () {
                        var grid = $("#optionDetailsGrid").data("kendoGrid");
                        var dataItem = grid.dataItem(this);

                        if (dataItem && selectedOptionGridModel) {
                            selectedOptionGridModel.set("OptionId", dataItem.Id);
                            selectedOptionGridModel.set("OptionName", dataItem.Name);
                            selectedOptionGridModel.set("OptionCode", dataItem.Code);
                            selectedOptionGridModel.set("IsActive", dataItem.IsActive || "");

                            var window = $("#optionDetailsWindow").data("kendoWindow");
                            if (window) window.close();
                        }
                    });
                }
            });
        }

        // Question Option Details Grid
        var questionOptionList = JSON.parse($("#OptionListJson").val() || "[]");
        var optionDetails = new kendo.data.DataSource({
            data: questionOptionList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        QuestionId: { type: "number", defaultValue: null },
                        OptionId: { type: "number", defaultValue: 0 },
                        OptionName: { type: "string", defaultValue: "" },
                        OptionCode: { type: "string", defaultValue: "" },
                        IsActive: { type: "boolean", defaultValue: true }
                    }
                }
            }
        });

        $("#optionDetails").kendoGrid({
            dataSource: optionDetails,
            toolbar: [{ name: "create", text: "Add Option" }],
            editable: { mode: "incell", createAt: "bottom" },
            columns: [
                { field: "OptionName", title: "Option Name", editor: optionSelectorEditor, width: 150 },
                { field: "OptionCode", title: "Option Code", width: 120 },
                { field: "IsActive", title: "Active", width: 100 },
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

        // Question Short Details Grid
        var questionShortList = JSON.parse($("#ShortDetailListJson").val() || "[]");
        var shortDetails = new kendo.data.DataSource({
            data: questionShortList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        QuestionId: { type: "number", defaultValue: null },
                        ShortDescription: { type: "string", defaultValue: "" },
                        Remarks: { type: "string", defaultValue: "" },
                        IsActive: { type: "boolean", defaultValue: true }
                    }
                }
            }
        });

        $("#shortDetails").kendoGrid({
            dataSource: shortDetails,
            toolbar: [{ name: "create", text: "Add Short Description" }],
            editable: { mode: "incell", createAt: "bottom" },
            columns: [
                { field: "ShortDescription", title: "Short Description", width: 150 },
                { field: "Remarks", title: "Remarks", width: 150 },
                { field: "IsActive", title: "Active", width: 100 },
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
    };

    // Fetch grid data
    var GetGridDataList = function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "/Questions/QuestionHeader/GetGridData",
                    type: "POST",
                    dataType: "json"
                }
            },
            schema: {
                data: "Items",
                total: "TotalCount"
            },
            pageSize: 10
        });

        $("#GridDataList").kendoGrid({
            dataSource: gridDataSource,
            pageable: true,
            sortable: true,
            filterable: true,
            columns: [
                { field: "Id", hidden: true },
                { field: "Code", title: "Code", width: 120 },
                { field: "Name", title: "Name", width: 200 },
                { field: "CategoryName", title: "Category", width: 150 },
                { field: "IsActive", title: "Active", width: 100 },
                {
                    command: [{
                        name: "edit",
                        iconClass: "k-icon k-i-pencil",
                        text: "Edit"
                    }],
                    title: "&nbsp;",
                    width: 80
                }
            ]
        });
    };

    return {
        init: init
    }
}(CommonService, CommonAjaxService);
