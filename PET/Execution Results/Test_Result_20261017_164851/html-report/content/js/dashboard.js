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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9061224489795918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MyOrders"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [1.0, 500, 1500, "T90_GotoAccount"], "isController": true}, {"data": [1.0, 500, 1500, "UpdateCart"], "isController": false}, {"data": [1.0, 500, 1500, "T120_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "T60_ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [1.0, 500, 1500, "GoToMyAccount"], "isController": false}, {"data": [0.8, 500, 1500, "Order Validation"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-3"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-2"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-5"], "isController": false}, {"data": [1.0, 500, 1500, "CATS"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-4"], "isController": false}, {"data": [1.0, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-7"], "isController": false}, {"data": [1.0, 500, 1500, "AddToCart"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-6"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-9"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-8"], "isController": false}, {"data": [0.7, 500, 1500, "Confirm"], "isController": false}, {"data": [0.4, 500, 1500, "T00_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-1"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-0"], "isController": false}, {"data": [1.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.5, 500, 1500, "T10_SignIn"], "isController": true}, {"data": [0.7, 500, 1500, "T80_ConfirmOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonContinue"], "isController": false}, {"data": [1.0, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn-1"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-13"], "isController": false}, {"data": [0.0, 500, 1500, "T100_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-14"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-15"], "isController": false}, {"data": [0.4, 500, 1500, "Launch"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-10"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-11"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-12"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "T70_ClickonContinue"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "FISH"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "BIRDS"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 0, 0.0, 634.2162162162163, 0, 13910, 146.0, 430.40000000000003, 1464.2999999999995, 13734.559999999998, 7.383461047254151, 259.334637287476, 4.92537341355364], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyOrders", 5, 0, 0.0, 13392.8, 12650, 13910, 13409.0, 13910.0, 13910.0, 13910.0, 0.2566866882283485, 297.59221870347557, 0.12708999114430927], "isController": false}, {"data": ["SignOut", 10, 0, 0.0, 201.0, 130, 281, 200.5, 279.8, 281.0, 281.0, 1.3827433628318584, 2.660430638136062, 0.9985729656388274], "isController": false}, {"data": ["T90_GotoAccount", 5, 0, 0.0, 191.6, 132, 411, 137.0, 411.0, 411.0, 411.0, 0.7892659826361483, 1.9341641179952644, 0.4007991318074191], "isController": true}, {"data": ["UpdateCart", 5, 0, 0.0, 137.0, 134, 142, 137.0, 142.0, 142.0, 142.0, 0.6295643414756988, 1.2555627911735079, 0.5241860913497859], "isController": false}, {"data": ["T120_Logout", 5, 0, 0.0, 402.0, 391, 421, 402.0, 421.0, 421.0, 421.0, 0.6916585973163646, 2.6615347039701205, 0.9989873685848665], "isController": true}, {"data": ["ProceedtoCheckout", 5, 0, 0.0, 201.8, 133, 462, 135.0, 462.0, 462.0, 462.0, 0.643915003219575, 1.3865552559562138, 0.3074945669671603], "isController": false}, {"data": ["DOGS", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 11.44261853448276, 3.434806034482759], "isController": false}, {"data": ["T60_ProceedtoCheckout", 5, 0, 0.0, 201.8, 133, 462, 135.0, 462.0, 462.0, 462.0, 0.6438320885912955, 1.386376714202936, 0.3074549719933041], "isController": true}, {"data": ["T20_ProductClick", 5, 0, 0.0, 137.2, 132, 145, 137.0, 145.0, 145.0, 145.0, 0.6292474200855777, 1.0126950667002266, 0.3140092106091115], "isController": true}, {"data": ["ClickonProduct", 5, 0, 0.0, 138.0, 134, 146, 136.0, 146.0, 146.0, 146.0, 0.6293266205160478, 1.0601449417872875, 0.3332235289490245], "isController": false}, {"data": ["GoToMyAccount", 5, 0, 0.0, 191.6, 132, 411, 137.0, 411.0, 411.0, 411.0, 0.7892659826361483, 1.9341641179952644, 0.4007991318074191], "isController": false}, {"data": ["Order Validation", 5, 0, 0.0, 316.6, 1, 1513, 2.0, 1513.0, 1513.0, 1513.0, 0.6481721545242416, 0.0, 0.0], "isController": false}, {"data": ["Launch-3", 5, 0, 0.0, 347.0, 130, 418, 392.0, 418.0, 418.0, 418.0, 0.642756138321121, 1.228392346381283, 0.25735353194498006], "isController": false}, {"data": ["Launch-2", 5, 0, 0.0, 339.4, 128, 410, 394.0, 410.0, 410.0, 410.0, 0.6215040397762585, 3.9620882535736484, 0.25309295369794904], "isController": false}, {"data": ["Launch-5", 5, 0, 0.0, 342.6, 124, 410, 397.0, 410.0, 410.0, 410.0, 0.6232859636000997, 0.34451157753677386, 0.25138388961605584], "isController": false}, {"data": ["CATS", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 11.506453804347824, 3.609035326086956], "isController": false}, {"data": ["Launch-4", 5, 0, 0.0, 344.2, 134, 428, 382.0, 428.0, 428.0, 428.0, 0.6235969069593416, 0.20644467915939135, 0.25272726209777996], "isController": false}, {"data": ["T50_UpdateCart", 5, 0, 0.0, 138.6, 134, 144, 138.0, 144.0, 144.0, 144.0, 0.629643621710112, 2.3354613320110817, 0.5242521014355874], "isController": true}, {"data": ["Launch-7", 5, 0, 0.0, 341.6, 132, 410, 390.0, 410.0, 410.0, 410.0, 0.6225099601593626, 0.42128847889691234, 0.2535025911977092], "isController": false}, {"data": ["AddToCart", 5, 0, 0.0, 141.0, 134, 158, 136.0, 158.0, 158.0, 158.0, 0.6294058408862034, 1.2504523854481369, 0.3347406454556898], "isController": false}, {"data": ["Launch-6", 5, 0, 0.0, 396.6, 377, 434, 389.0, 434.0, 434.0, 434.0, 0.6230529595015577, 0.36567854361370716, 0.2512899143302181], "isController": false}, {"data": ["Launch-9", 5, 0, 0.0, 350.0, 133, 439, 391.0, 439.0, 439.0, 439.0, 0.620963735717834, 0.3310998043964233, 0.2510536978390462], "isController": false}, {"data": ["Launch-8", 5, 0, 0.0, 346.8, 129, 423, 386.0, 423.0, 423.0, 423.0, 0.6156877231867997, 0.35113440462997164, 0.24831936491811352], "isController": false}, {"data": ["Confirm", 5, 0, 0.0, 495.4, 136, 1505, 151.0, 1505.0, 1505.0, 1505.0, 0.6371049949031601, 1.2740855552370032, 0.31170859613914376], "isController": false}, {"data": ["T00_Launch", 5, 0, 0.0, 1454.6, 1414, 1514, 1437.0, 1514.0, 1514.0, 1514.0, 0.5336748852598997, 29.124472996050805, 3.4292780712989646], "isController": true}, {"data": ["Launch-1", 5, 0, 0.0, 345.0, 145, 404, 396.0, 404.0, 404.0, 404.0, 0.6226650062266501, 1.0969606164383563, 0.25052537359900373], "isController": false}, {"data": ["Launch-0", 5, 0, 0.0, 447.8, 392, 611, 401.0, 611.0, 611.0, 611.0, 0.6027000964320154, 1.1413633076181293, 0.214241049903568], "isController": false}, {"data": ["T30_ClickonProductLink", 5, 0, 0.0, 138.0, 134, 146, 136.0, 146.0, 146.0, 146.0, 0.6293266205160478, 1.0601449417872875, 0.3332235289490245], "isController": true}, {"data": ["T10_SignIn", 5, 0, 0.0, 545.4, 535, 570, 541.0, 570.0, 570.0, 570.0, 0.5979430758191819, 3.4066405315713943, 1.50361662132265], "isController": true}, {"data": ["T80_ConfirmOrder", 5, 0, 0.0, 495.4, 136, 1505, 151.0, 1505.0, 1505.0, 1505.0, 0.6370238246910435, 1.2739232306663268, 0.3116688829787234], "isController": true}, {"data": ["ClickonContinue", 5, 0, 0.0, 137.2, 134, 144, 136.0, 144.0, 144.0, 144.0, 0.6723141051499261, 1.2083270303885976, 0.7228689743848326], "isController": false}, {"data": ["T40_AddToCart", 5, 0, 0.0, 141.0, 134, 158, 136.0, 158.0, 158.0, 158.0, 0.6294058408862034, 1.2504523854481369, 0.3347406454556898], "isController": true}, {"data": ["SignIn-1", 5, 0, 0.0, 136.4, 133, 144, 135.0, 144.0, 144.0, 144.0, 0.6289308176100629, 1.151852397798742, 0.38325471698113206], "isController": false}, {"data": ["SignIn-0", 5, 0, 0.0, 136.4, 135, 139, 136.0, 139.0, 139.0, 139.0, 0.6285355122564426, 0.14363018541797612, 0.5395339016341923], "isController": false}, {"data": ["SignOut-0", 5, 0, 0.0, 133.2, 130, 139, 133.0, 139.0, 139.0, 139.0, 0.7183908045977011, 0.16416352370689655, 0.3500752065373563], "isController": false}, {"data": ["SignOut-1", 5, 0, 0.0, 134.8, 131, 141, 135.0, 141.0, 141.0, 141.0, 0.7188039102932721, 1.3272601890454283, 0.34395890238642896], "isController": false}, {"data": ["Launch-13", 5, 0, 0.0, 232.8, 136, 375, 247.0, 375.0, 375.0, 375.0, 0.6242976651267325, 0.587717723810713, 0.255449923523536], "isController": false}, {"data": ["T100_MyOrders", 5, 0, 0.0, 13392.8, 12650, 13910, 13409.0, 13910.0, 13910.0, 13910.0, 0.2566998665160694, 297.60749708003897, 0.1270965159410617], "isController": true}, {"data": ["Launch-14", 5, 0, 0.0, 185.4, 123, 256, 209.0, 256.0, 256.0, 256.0, 0.622975330176925, 0.46601474894094197, 0.2530837278843758], "isController": false}, {"data": ["Launch-15", 5, 0, 0.0, 269.0, 253, 280, 276.0, 280.0, 280.0, 280.0, 0.6165988407941793, 21.91575332963374, 0.24808468985078308], "isController": false}, {"data": ["Launch", 5, 0, 0.0, 1454.6, 1414, 1514, 1437.0, 1514.0, 1514.0, 1514.0, 0.5371146202599635, 29.312191159093352, 3.4513810559673437], "isController": false}, {"data": ["Launch-10", 5, 0, 0.0, 329.2, 133, 398, 373.0, 398.0, 398.0, 398.0, 0.6256256256256256, 0.4484464933683684, 0.25354944788538536], "isController": false}, {"data": ["Launch-11", 5, 0, 0.0, 340.0, 131, 404, 393.0, 404.0, 404.0, 404.0, 0.625860558267618, 0.4663394589435474, 0.25364465984478657], "isController": false}, {"data": ["Launch-12", 5, 0, 0.0, 275.6, 135, 384, 265.0, 384.0, 384.0, 384.0, 0.6334726973267453, 0.4348938537311542, 0.2567296576080071], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 1.6, 0, 7, 0.0, 7.0, 7.0, 7.0, 0.6443298969072165, 1.1049250966494846, 0.0], "isController": false}, {"data": ["T70_ClickonContinue", 5, 0, 0.0, 137.2, 134, 144, 136.0, 144.0, 144.0, 144.0, 0.6723141051499261, 1.2083270303885976, 0.7228689743848326], "isController": true}, {"data": ["SignIn", 15, 0, 0.0, 181.79999999999998, 133, 284, 137.0, 277.4, 284.0, 284.0, 1.7936147315556619, 3.406233184861892, 1.5034368273944758], "isController": false}, {"data": ["FISH", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 12.039412313432836, 3.7167677238805967], "isController": false}, {"data": ["REPTILES", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 11.640339872262773, 3.663891423357664], "isController": false}, {"data": ["BIRDS", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 12.059067234848484, 3.780480587121212], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 185, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
