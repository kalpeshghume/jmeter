/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 11.11111111111111, "KoPercent": 88.88888888888889};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [0.0, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [0.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [0.0, 500, 1500, "AddToCart"], "isController": false}, {"data": [0.0, 500, 1500, "T00_Launch"], "isController": true}, {"data": [0.0, 500, 1500, "Launch"], "isController": false}, {"data": [0.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateCart"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "SignIn"], "isController": false}, {"data": [0.0, 500, 1500, "FISH"], "isController": false}, {"data": [0.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.0, 500, 1500, "T10_SignIn"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9, 8, 88.88888888888889, 249.77777777777777, 0, 1564, 134.0, 1564.0, 1564.0, 1564.0, 3.87263339070568, 3.8810375430292603, 1.3064254787005165], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["T40_AddToCart", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": true}, {"data": ["T50_UpdateCart", 1, 1, 100.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 11.244419642857142, 4.617745535714286], "isController": true}, {"data": ["T20_ProductClick", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 7.426247667910447, 3.3305153917910446], "isController": true}, {"data": ["AddToCart", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["T00_Launch", 1, 1, 100.0, 1564.0, 1564, 1564, 1564.0, 1564.0, 1564.0, 1564.0, 0.639386189258312, 0.6362641863810742, 0.2272818094629156], "isController": true}, {"data": ["Launch", 1, 1, 100.0, 1564.0, 1564, 1564, 1564.0, 1564.0, 1564.0, 1564.0, 0.639386189258312, 0.6362641863810742, 0.2272818094629156], "isController": false}, {"data": ["ClickonProduct", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["UpdateCart", 1, 1, 100.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 7.189764492753622, 4.684669384057971], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 291.015625, 0.0], "isController": false}, {"data": ["SignIn", 3, 3, 100.0, 136.66666666666666, 134, 139, 137.0, 139.0, 139.0, 139.0, 7.263922518159807, 7.3159427966101696, 3.8447714891041165], "isController": false}, {"data": ["FISH", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 7.426247667910447, 3.3305153917910446], "isController": false}, {"data": ["T30_ClickonProductLink", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": true}, {"data": ["T10_SignIn", 1, 1, 100.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 7.369474085365854, 3.8729039634146343], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=No Items Found", 1, 12.5, 11.11111111111111], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=No Products Found", 1, 12.5, 11.11111111111111], "isController": false}, {"data": ["404/Not Found", 6, 75.0, 66.66666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9, 8, "404/Not Found", 6, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=No Items Found", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=No Products Found", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AddToCart", 1, 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 81: https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&amp;workingItemId=No Items Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Launch", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ClickonProduct", 1, 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&amp;productId=No Products Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["UpdateCart", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["SignIn", 3, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["FISH", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
