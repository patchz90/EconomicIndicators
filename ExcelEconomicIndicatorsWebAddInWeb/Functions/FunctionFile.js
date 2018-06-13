// The initialize function must be run each time a new page is loaded.
(function () {
    Office.initialize = function (reason) {
        // If you need to initialize something you can do so here.
    };
})();

const currencyIndexes = [{ Currency: "EUR", Index: 0.848789796 },
{ Currency: "GBP", Index: 0.74654499 },
{ Currency: "CNY", Index: 6.40090125 }]

//Currency functions
function convertToEur() {
    convertToCurrency("EUR");
}

function convertToGbp() {
    convertToCurrency("GBP");
}

function convertToCny() {
    convertToCurrency("CNY");
}

function convertToCurrency(currency) {
    Excel.run(function (context) {
        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();

        var timePointsTable = currentWorksheet.tables.getItem("TimePointsTable");
        if (timePointsTable) {
            var index = currencyIndexes.filter(function (element) {
                return element.Currency === currency;
            })[0].Index;

            var indicatorColumnRange = timePointsTable.columns.getItemAt(1).getDataBodyRange().load("values");

            return context.sync()
                .then(function () {
                    var indicatorValues = indicatorColumnRange.values;
                    var values = [[currency]];
                    for (var i = 0; i < indicatorValues.length; i++) {
                        values.push([(Number(Math.round(indicatorValues[i] * index + 'e2') + 'e-2')).toString()]);
                    }
                    timePointsTable.columns.add(null, values);
                    timePointsTable.getRange().format.autofitColumns();
                    timePointsTable.getRange().format.autofitRows();
                    // Sync to update the sheet in Excel
                    return context.sync();
                });
        }
    }).catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    });
}

//Calculate functions
function lnCalculate() {
    calculate("LN");
}

function log10Calculate() {
    calculate("LOG10");
}

function sqrtCalculate() {
    calculate("SQRT");
}

function calculate(functionToCalculate) {
    Excel.run(function (context) {
        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        var functionHeaderName;
        switch (functionToCalculate) {
            case "LN":
                functionHeaderName = "Natural Log";
                break;
            case "LOG10":
                functionHeaderName = "Base 10 Log";
                break;
            case "SQRT":
                functionHeaderName = "Square Root";
                break;
        }
        var timePointsTable = currentWorksheet.tables.getItem("TimePointsTable");
        if (timePointsTable) {
            var indicatorColumnRange = timePointsTable.columns.getItemAt(1).getDataBodyRange().load("values");
            var headerRange = timePointsTable.getHeaderRowRange().load("values");
            return context.sync()
                .then(function () {
                    var indicatorValues = indicatorColumnRange.values;
                    var currentIndicatorName = headerRange.values[0][1];
                    var values = [[functionHeaderName]];
                    for (var i = 0; i < indicatorValues.length; i++) {
                        values.push(['=' + functionToCalculate + '([' + currentIndicatorName + '])']);
                    }
                    timePointsTable.columns.add(null, values);
                    timePointsTable.getRange().format.autofitColumns();
                    timePointsTable.getRange().format.autofitRows();
                    // Sync to update the sheet in Excel
                    return context.sync();
                });
        }
    }).catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    });
}