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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8755102040816326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MyOrders"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [0.9, 500, 1500, "T90_GotoAccount"], "isController": true}, {"data": [1.0, 500, 1500, "UpdateCart"], "isController": false}, {"data": [1.0, 500, 1500, "T120_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "T60_ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [0.9, 500, 1500, "GoToMyAccount"], "isController": false}, {"data": [0.9, 500, 1500, "Order Validation"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-3"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-2"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-5"], "isController": false}, {"data": [1.0, 500, 1500, "CATS"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-4"], "isController": false}, {"data": [1.0, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-7"], "isController": false}, {"data": [1.0, 500, 1500, "AddToCart"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-6"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-9"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-8"], "isController": false}, {"data": [0.6, 500, 1500, "Confirm"], "isController": false}, {"data": [0.2, 500, 1500, "T00_Launch"], "isController": true}, {"data": [0.9, 500, 1500, "Launch-1"], "isController": false}, {"data": [0.8, 500, 1500, "Launch-0"], "isController": false}, {"data": [1.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.5, 500, 1500, "T10_SignIn"], "isController": true}, {"data": [0.6, 500, 1500, "T80_ConfirmOrder"], "isController": true}, {"data": [0.9, 500, 1500, "ClickonContinue"], "isController": false}, {"data": [1.0, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn-1"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-13"], "isController": false}, {"data": [0.0, 500, 1500, "T100_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-14"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-15"], "isController": false}, {"data": [0.2, 500, 1500, "Launch"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-10"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-11"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-12"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9, 500, 1500, "T70_ClickonContinue"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "FISH"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "BIRDS"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 0, 0.0, 653.6432432432433, 0, 13552, 217.0, 516.0, 1498.199999999999, 13226.919999999995, 7.072946933781925, 248.428748422924, 4.7182350607891115], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyOrders", 5, 0, 0.0, 12970.4, 12336, 13552, 13077.0, 13552.0, 13552.0, 13552.0, 0.24332084286339967, 282.09672801900336, 0.1204723313786559], "isController": false}, {"data": ["SignOut", 10, 0, 0.0, 202.1, 127, 282, 199.0, 281.1, 282.0, 282.0, 1.159285879897983, 2.2310592612450733, 0.8371991290864828], "isController": false}, {"data": ["T90_GotoAccount", 5, 0, 0.0, 219.0, 129, 510, 144.0, 510.0, 510.0, 510.0, 0.6208095356344674, 1.521589621616588, 0.31525484231437795], "isController": true}, {"data": ["UpdateCart", 5, 0, 0.0, 141.4, 133, 154, 140.0, 154.0, 154.0, 154.0, 0.5946010227137591, 1.1847889909620644, 0.49507503121655366], "isController": false}, {"data": ["T120_Logout", 5, 0, 0.0, 404.2, 384, 423, 409.0, 423.0, 423.0, 423.0, 0.5797773654916513, 2.231576668309369, 0.8373932847286641], "isController": true}, {"data": ["ProceedtoCheckout", 5, 0, 0.0, 138.0, 132, 149, 135.0, 149.0, 149.0, 149.0, 0.6104260774020266, 1.3142044240629958, 0.2915022967281162], "isController": false}, {"data": ["DOGS", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 11.957621402877697, 3.583071043165467], "isController": false}, {"data": ["T60_ProceedtoCheckout", 5, 0, 0.0, 138.0, 132, 149, 135.0, 149.0, 149.0, 149.0, 0.6102770657878677, 1.313883612535091, 0.2914311378615892], "isController": true}, {"data": ["T20_ProductClick", 5, 0, 0.0, 151.4, 137, 202, 139.0, 202.0, 202.0, 202.0, 0.5936832106388031, 0.9551110558655901, 0.2962618365590121], "isController": true}, {"data": ["ClickonProduct", 5, 0, 0.0, 153.6, 135, 205, 143.0, 205.0, 205.0, 205.0, 0.5938242280285035, 0.9995267963182898, 0.31442528948931114], "isController": false}, {"data": ["GoToMyAccount", 5, 0, 0.0, 219.0, 129, 510, 144.0, 510.0, 510.0, 510.0, 0.6208095356344674, 1.521589621616588, 0.31525484231437795], "isController": false}, {"data": ["Order Validation", 5, 0, 0.0, 268.8, 1, 1336, 2.0, 1336.0, 1336.0, 1336.0, 0.5404821100421576, 0.0, 0.0], "isController": false}, {"data": ["Launch-3", 5, 0, 0.0, 384.2, 123, 516, 411.0, 516.0, 516.0, 516.0, 0.5907372400756143, 1.1289773230741966, 0.23652565276465026], "isController": false}, {"data": ["Launch-2", 5, 0, 0.0, 345.2, 130, 516, 424.0, 516.0, 516.0, 516.0, 0.611321677466683, 3.897175693850104, 0.248946425296491], "isController": false}, {"data": ["Launch-5", 5, 0, 0.0, 451.0, 403, 516, 451.0, 516.0, 516.0, 516.0, 0.5910165484633569, 0.3266751625295508, 0.23836897901891252], "isController": false}, {"data": ["CATS", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 11.182328345070424, 3.50737235915493], "isController": false}, {"data": ["Launch-4", 5, 0, 0.0, 390.8, 217, 488, 408.0, 488.0, 488.0, 488.0, 0.5905279319711823, 0.195497039978741, 0.23932528492972716], "isController": false}, {"data": ["T50_UpdateCart", 5, 0, 0.0, 145.0, 133, 161, 141.0, 161.0, 161.0, 161.0, 0.5943889681407514, 2.203534571148359, 0.4948984709343794], "isController": true}, {"data": ["Launch-7", 5, 0, 0.0, 357.4, 127, 441, 396.0, 441.0, 441.0, 441.0, 0.5896921806816842, 0.39907879024649134, 0.24013831967213117], "isController": false}, {"data": ["AddToCart", 5, 0, 0.0, 145.6, 137, 161, 141.0, 161.0, 161.0, 161.0, 0.594035879767138, 1.1809943789354878, 0.3159296290245931], "isController": false}, {"data": ["Launch-6", 5, 0, 0.0, 396.2, 143, 515, 444.0, 515.0, 515.0, 515.0, 0.5910165484633569, 0.34687592346335694, 0.23836897901891252], "isController": false}, {"data": ["Launch-9", 5, 0, 0.0, 357.6, 121, 480, 389.0, 480.0, 480.0, 480.0, 0.5881660981061052, 0.31361200152923185, 0.23779371544524175], "isController": false}, {"data": ["Launch-8", 5, 0, 0.0, 358.6, 122, 481, 402.0, 481.0, 481.0, 481.0, 0.5808550185873607, 0.33126887778810404, 0.23427062761384757], "isController": false}, {"data": ["Confirm", 5, 0, 0.0, 870.6, 143, 1766, 1065.0, 1766.0, 1766.0, 1766.0, 0.532197977647685, 1.0632525612027675, 0.26038201836083025], "isController": false}, {"data": ["T00_Launch", 5, 0, 0.0, 1580.2, 1416, 1823, 1527.0, 1823.0, 1823.0, 1823.0, 0.5110906674844118, 27.892274065981805, 3.2841568281713176], "isController": true}, {"data": ["Launch-1", 5, 0, 0.0, 455.6, 393, 516, 454.0, 516.0, 516.0, 516.0, 0.5908070424199456, 1.0408358442632637, 0.23770752097365003], "isController": false}, {"data": ["Launch-0", 5, 0, 0.0, 489.6, 373, 675, 445.0, 675.0, 675.0, 675.0, 0.5824790307548928, 1.1034109607991613, 0.20705309296365332], "isController": false}, {"data": ["T30_ClickonProductLink", 5, 0, 0.0, 153.6, 135, 205, 143.0, 205.0, 205.0, 205.0, 0.5938242280285035, 0.9995267963182898, 0.31442528948931114], "isController": true}, {"data": ["T10_SignIn", 5, 0, 0.0, 595.0, 538, 758, 561.0, 758.0, 758.0, 758.0, 0.565866908103214, 3.224888771785876, 1.4229563362947035], "isController": true}, {"data": ["T80_ConfirmOrder", 5, 0, 0.0, 870.6, 143, 1766, 1065.0, 1766.0, 1766.0, 1766.0, 0.5321413367390379, 1.0631394010749253, 0.26035430635376755], "isController": true}, {"data": ["ClickonContinue", 5, 0, 0.0, 249.2, 132, 560, 141.0, 560.0, 560.0, 560.0, 0.6104260774020266, 1.0978131485777072, 0.6563272570504212], "isController": false}, {"data": ["T40_AddToCart", 5, 0, 0.0, 145.6, 137, 161, 141.0, 161.0, 161.0, 161.0, 0.594035879767138, 1.1809943789354878, 0.3159296290245931], "isController": true}, {"data": ["SignIn-1", 5, 0, 0.0, 151.8, 134, 205, 141.0, 205.0, 205.0, 205.0, 0.5936832106388031, 1.0878781019947754, 0.36177570648302065], "isController": false}, {"data": ["SignIn-0", 5, 0, 0.0, 141.8, 134, 152, 141.0, 152.0, 152.0, 152.0, 0.5930494603249912, 0.13552106808207806, 0.5090727301031907], "isController": false}, {"data": ["SignOut-0", 5, 0, 0.0, 132.6, 127, 140, 133.0, 140.0, 140.0, 140.0, 0.5990893841361131, 0.13690128504672897, 0.29193906512101603], "isController": false}, {"data": ["SignOut-1", 5, 0, 0.0, 136.2, 130, 142, 137.0, 142.0, 142.0, 142.0, 0.5987306909352174, 1.1054299260567595, 0.28650199077954736], "isController": false}, {"data": ["Launch-13", 5, 0, 0.0, 256.4, 129, 412, 268.0, 412.0, 412.0, 412.0, 0.5938242280285035, 0.5590298396674585, 0.24298081205463182], "isController": false}, {"data": ["T100_MyOrders", 5, 0, 0.0, 12970.4, 12336, 13552, 13077.0, 13552.0, 13552.0, 13552.0, 0.24330900243309003, 282.08300068430657, 0.12046646897810219], "isController": true}, {"data": ["Launch-14", 5, 0, 0.0, 208.0, 123, 298, 244.0, 298.0, 298.0, 298.0, 0.5892751915144372, 0.44080546552740135, 0.23939304655274016], "isController": false}, {"data": ["Launch-15", 5, 0, 0.0, 273.0, 252, 307, 271.0, 307.0, 307.0, 307.0, 0.5832944470368642, 20.732016303079796, 0.23468487517498834], "isController": false}, {"data": ["Launch", 5, 0, 0.0, 1580.2, 1416, 1823, 1527.0, 1823.0, 1823.0, 1823.0, 0.5137690094533497, 28.03844196336827, 3.301367267776408], "isController": false}, {"data": ["Launch-10", 5, 0, 0.0, 373.8, 130, 480, 414.0, 480.0, 480.0, 480.0, 0.5929088106249258, 0.4249951826159137, 0.24029019180600025], "isController": false}, {"data": ["Launch-11", 5, 0, 0.0, 363.2, 132, 480, 400.0, 480.0, 480.0, 480.0, 0.5941770647653001, 0.44273154337492576, 0.2408041815210933], "isController": false}, {"data": ["Launch-12", 5, 0, 0.0, 270.8, 135, 387, 273.0, 387.0, 387.0, 387.0, 0.6032818532818532, 0.41416713169642855, 0.24449411046090733], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 3.6, 0, 16, 1.0, 16.0, 16.0, 16.0, 0.6104260774020266, 1.046666119826639, 0.0], "isController": false}, {"data": ["T70_ClickonContinue", 5, 0, 0.0, 249.2, 132, 560, 141.0, 560.0, 560.0, 560.0, 0.6105006105006106, 1.0979471916971917, 0.6564073946886447], "isController": true}, {"data": ["SignIn", 15, 0, 0.0, 198.3333333333333, 134, 358, 143.0, 313.6, 358.0, 358.0, 1.6970245502884942, 3.223794228702342, 1.4224733779273673], "isController": false}, {"data": ["FISH", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 11.74013458029197, 3.635378649635036], "isController": false}, {"data": ["REPTILES", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 7.870513613861386, 2.4849164603960396], "isController": false}, {"data": ["BIRDS", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 11.64746806569343, 3.6425068430656933], "isController": false}]}, function(index, item){
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
