(function () {
    "use strict";

    var cellToHighlight;
    var messageBanner;
    var economicIndicators;

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            $.ajax({
                type: 'GET',
                url: 'api/GetIndicatorNames',
                crossDomain: true,
                async: false,
                success: function (result) {
                    economicIndicators = result
                }
            });
            loadData(economicIndicators[0].Name);
            indicatorsDropdownFill();
            $("#refresh-button").click(function () {
                loadData($("#indicators-dropdown option:selected").text());
            });
        });
    };

    function indicatorsDropdownFill() {
        for (var i = 0; i < economicIndicators.length; i++) {
            $("#indicators-dropdown").append("<option value=" + economicIndicators[i].Name + ">" + economicIndicators[i].Name + "</option>");
        }
    }
    
    function loadData(indicatorName) {
        Excel.run(function (context) {
            var indicator = economicIndicators[0];
            if (indicatorName) {
                indicator = economicIndicators.filter(function (element) {
                    return element.Name === indicatorName;
                })[0];
            }
            
            const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
            currentWorksheet.getRange().clear();
            const expensesTable = currentWorksheet.tables.add("A1:B1", true /*hasHeaders*/);
            expensesTable.name = "TimePointsTable";
            expensesTable.getHeaderRowRange().values =
                [[" ", indicator.Name]];
            var rows = [];
            for (var i = 0; i < indicator.TimePoints.length; i++){
                rows.push([indicator.TimePoints[i].Year, indicator.TimePoints[i].Value.toString()]);
        }

        expensesTable.rows.add(null /*add at the end*/,
            rows
        );
        expensesTable.columns.getItemAt(1).getRange().numberFormat = [['#,##0.00']];
        expensesTable.getRange().format.autofitColumns();
        expensesTable.getRange().format.autofitRows();

        return context.sync();
    }).catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    });
    }
})();
