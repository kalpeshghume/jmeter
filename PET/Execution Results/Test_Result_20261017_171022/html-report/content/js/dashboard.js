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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9122448979591836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MyOrders"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [1.0, 500, 1500, "T90_GotoAccount"], "isController": true}, {"data": [1.0, 500, 1500, "UpdateCart"], "isController": false}, {"data": [1.0, 500, 1500, "T120_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "T60_ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [1.0, 500, 1500, "GoToMyAccount"], "isController": false}, {"data": [0.9, 500, 1500, "Order Validation"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-3"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-2"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-5"], "isController": false}, {"data": [1.0, 500, 1500, "CATS"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-4"], "isController": false}, {"data": [1.0, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-7"], "isController": false}, {"data": [1.0, 500, 1500, "AddToCart"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-6"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-9"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-8"], "isController": false}, {"data": [0.9, 500, 1500, "Confirm"], "isController": false}, {"data": [0.4, 500, 1500, "T00_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-1"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-0"], "isController": false}, {"data": [1.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.5, 500, 1500, "T10_SignIn"], "isController": true}, {"data": [0.9, 500, 1500, "T80_ConfirmOrder"], "isController": true}, {"data": [0.9, 500, 1500, "ClickonContinue"], "isController": false}, {"data": [1.0, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn-1"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-13"], "isController": false}, {"data": [0.0, 500, 1500, "T100_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-14"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-15"], "isController": false}, {"data": [0.4, 500, 1500, "Launch"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-10"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-11"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-12"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9, 500, 1500, "T70_ClickonContinue"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "FISH"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "BIRDS"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 0, 0.0, 636.1243243243246, 0, 14192, 151.0, 432.4, 1469.1, 13595.15999999999, 7.457873095218899, 261.9620442130936, 4.975012345803434], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyOrders", 5, 0, 0.0, 13337.4, 12388, 14192, 13435.0, 14192.0, 14192.0, 14192.0, 0.25998336106489184, 301.4334426346714, 0.12872223052724627], "isController": false}, {"data": ["SignOut", 10, 0, 0.0, 206.20000000000002, 133, 284, 204.5, 283.5, 284.0, 284.0, 1.3798813302056023, 2.6547892662481027, 0.9965060973506279], "isController": false}, {"data": ["T90_GotoAccount", 5, 0, 0.0, 205.8, 137, 465, 141.0, 465.0, 465.0, 465.0, 0.7777259293824856, 1.9045171294135945, 0.3949389485145435], "isController": true}, {"data": ["UpdateCart", 5, 0, 0.0, 137.6, 130, 145, 135.0, 145.0, 145.0, 145.0, 0.6138735420503376, 1.2247496546961327, 0.5111216620626151], "isController": false}, {"data": ["T120_Logout", 5, 0, 0.0, 412.4, 401, 427, 415.0, 427.0, 427.0, 427.0, 0.690035881865857, 2.6551556462186032, 0.9966436223433618], "isController": true}, {"data": ["ProceedtoCheckout", 5, 0, 0.0, 146.0, 129, 180, 141.0, 180.0, 180.0, 180.0, 0.6305170239596469, 1.3570893757881464, 0.30109650851197983], "isController": false}, {"data": ["DOGS", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 11.422413793103448, 3.434806034482759], "isController": false}, {"data": ["T60_ProceedtoCheckout", 5, 0, 0.0, 146.0, 129, 180, 141.0, 180.0, 180.0, 180.0, 0.6304375236414071, 1.3569182637750599, 0.30105854400453913], "isController": true}, {"data": ["T20_ProductClick", 5, 0, 0.0, 137.0, 131, 145, 134.0, 145.0, 145.0, 145.0, 0.6150818058801821, 0.9888160828515193, 0.3069402371140362], "isController": true}, {"data": ["ClickonProduct", 5, 0, 0.0, 138.4, 129, 148, 137.0, 148.0, 148.0, 148.0, 0.6144770800049157, 1.0346497864692146, 0.3253608132604154], "isController": false}, {"data": ["GoToMyAccount", 5, 0, 0.0, 205.8, 137, 465, 141.0, 465.0, 465.0, 465.0, 0.7777259293824856, 1.9045171294135945, 0.3949389485145435], "isController": false}, {"data": ["Order Validation", 5, 0, 0.0, 258.2, 2, 1282, 2.0, 1282.0, 1282.0, 1282.0, 0.6600660066006601, 0.0, 0.0], "isController": false}, {"data": ["Launch-3", 5, 0, 0.0, 409.8, 389, 432, 409.0, 432.0, 432.0, 432.0, 0.6187353050365054, 1.182485343707462, 0.24773581549313206], "isController": false}, {"data": ["Launch-2", 5, 0, 0.0, 294.0, 129, 411, 389.0, 411.0, 411.0, 411.0, 0.6185822095756526, 3.9434615860447852, 0.25190310682914757], "isController": false}, {"data": ["Launch-5", 5, 0, 0.0, 357.0, 131, 431, 408.0, 431.0, 431.0, 431.0, 0.6187353050365054, 0.34199627211978717, 0.2495485165821062], "isController": false}, {"data": ["CATS", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 11.240857712765958, 3.532247340425532], "isController": false}, {"data": ["Launch-4", 5, 0, 0.0, 408.2, 393, 433, 403.0, 433.0, 433.0, 433.0, 0.6186587478346943, 0.20480987843355603, 0.2507259573744123], "isController": false}, {"data": ["T50_UpdateCart", 5, 0, 0.0, 139.0, 133, 146, 136.0, 146.0, 146.0, 146.0, 0.6138735420503376, 2.277446861571516, 0.5111216620626151], "isController": true}, {"data": ["Launch-7", 5, 0, 0.0, 351.4, 130, 413, 405.0, 413.0, 413.0, 413.0, 0.6205783790492739, 0.41998126629018245, 0.2527160000620578], "isController": false}, {"data": ["AddToCart", 5, 0, 0.0, 140.0, 133, 151, 139.0, 151.0, 151.0, 151.0, 0.6137228427642077, 1.2196542822511354, 0.3263998634466675], "isController": false}, {"data": ["Launch-6", 5, 0, 0.0, 401.0, 377, 425, 398.0, 425.0, 425.0, 425.0, 0.6187353050365054, 0.3631444514911521, 0.2495485165821062], "isController": false}, {"data": ["Launch-9", 5, 0, 0.0, 339.0, 126, 400, 393.0, 400.0, 400.0, 400.0, 0.6198090987975703, 0.3304841483822982, 0.25058688174042393], "isController": false}, {"data": ["Launch-8", 5, 0, 0.0, 349.6, 129, 420, 406.0, 420.0, 420.0, 420.0, 0.6100536847242557, 0.3479212420693021, 0.2460470427647633], "isController": false}, {"data": ["Confirm", 5, 0, 0.0, 437.19999999999993, 140, 1460, 151.0, 1460.0, 1460.0, 1460.0, 0.6481721545242416, 1.2959645206766917, 0.31712329044594245], "isController": false}, {"data": ["T00_Launch", 5, 0, 0.0, 1475.2, 1432, 1511, 1476.0, 1511.0, 1511.0, 1511.0, 0.5283178360101437, 28.832636339021555, 3.394854844674556], "isController": true}, {"data": ["Launch-1", 5, 0, 0.0, 295.4, 133, 408, 398.0, 408.0, 408.0, 408.0, 0.640450877417702, 1.1282943192007173, 0.25768140771102854], "isController": false}, {"data": ["Launch-0", 5, 0, 0.0, 444.2, 391, 591, 411.0, 591.0, 591.0, 591.0, 0.6023370678231539, 1.1412640419828937, 0.21411200457776172], "isController": false}, {"data": ["T30_ClickonProductLink", 5, 0, 0.0, 138.4, 129, 148, 137.0, 148.0, 148.0, 148.0, 0.6144770800049157, 1.0346497864692146, 0.3253608132604154], "isController": true}, {"data": ["T10_SignIn", 5, 0, 0.0, 555.0, 514, 585, 555.0, 585.0, 585.0, 585.0, 0.5874060150375939, 3.346149186442669, 1.477119617892387], "isController": true}, {"data": ["T80_ConfirmOrder", 5, 0, 0.0, 437.19999999999993, 140, 1460, 151.0, 1460.0, 1460.0, 1460.0, 0.6480881399870383, 1.2957965408295529, 0.3170821856772521], "isController": true}, {"data": ["ClickonContinue", 5, 0, 0.0, 216.2, 134, 518, 145.0, 518.0, 518.0, 518.0, 0.6298022420959819, 1.1313068790149894, 0.6771604185035899], "isController": false}, {"data": ["T40_AddToCart", 5, 0, 0.0, 140.0, 133, 151, 139.0, 151.0, 151.0, 151.0, 0.6137981831573779, 1.2198040065676405, 0.3264399321753007], "isController": true}, {"data": ["SignIn-1", 5, 0, 0.0, 137.0, 128, 145, 135.0, 145.0, 145.0, 145.0, 0.6160670280926565, 1.127811768420404, 0.37541584524396254], "isController": false}, {"data": ["SignIn-0", 5, 0, 0.0, 137.4, 130, 145, 135.0, 145.0, 145.0, 145.0, 0.616370808678501, 0.14085036057692307, 0.5290917390902367], "isController": false}, {"data": ["SignOut-0", 5, 0, 0.0, 136.6, 132, 141, 138.0, 141.0, 141.0, 141.0, 0.7165376898824878, 0.16374005803955288, 0.34917217505015763], "isController": false}, {"data": ["SignOut-1", 5, 0, 0.0, 137.4, 134, 142, 137.0, 142.0, 142.0, 142.0, 0.7172572084349448, 1.3241240496341988, 0.3432187813800029], "isController": false}, {"data": ["Launch-13", 5, 0, 0.0, 293.8, 136, 434, 272.0, 434.0, 434.0, 434.0, 0.6208866261020738, 0.5845065503539053, 0.2540541956413759], "isController": false}, {"data": ["T100_MyOrders", 5, 0, 0.0, 13337.4, 12388, 14192, 13435.0, 14192.0, 14192.0, 14192.0, 0.25999688003743954, 301.44911698559616, 0.12872892400291194], "isController": true}, {"data": ["Launch-14", 5, 0, 0.0, 201.0, 128, 264, 214.0, 264.0, 264.0, 264.0, 0.6167509559639817, 0.4613586252621192, 0.2505550758603676], "isController": false}, {"data": ["Launch-15", 5, 0, 0.0, 276.6, 259, 287, 278.0, 287.0, 287.0, 287.0, 0.6082725060827251, 21.61981067518248, 0.24473464111922139], "isController": false}, {"data": ["Launch", 5, 0, 0.0, 1475.2, 1432, 1511, 1476.0, 1511.0, 1511.0, 1511.0, 0.5323112956456937, 29.050577058713934, 3.4205159427233043], "isController": false}, {"data": ["Launch-10", 5, 0, 0.0, 346.8, 129, 417, 403.0, 417.0, 417.0, 417.0, 0.6195786864931846, 0.44411206629491945, 0.25109878407682773], "isController": false}, {"data": ["Launch-11", 5, 0, 0.0, 367.4, 132, 470, 412.0, 470.0, 470.0, 470.0, 0.6152331733727083, 0.45842081180017225, 0.24933766303679092], "isController": false}, {"data": ["Launch-12", 5, 0, 0.0, 255.2, 132, 372, 266.0, 372.0, 372.0, 372.0, 0.6309944472488642, 0.43319247696870267, 0.2557252886799596], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 1.4, 0, 6, 0.0, 6.0, 6.0, 6.0, 0.6313131313131314, 1.0826033775252526, 0.0], "isController": false}, {"data": ["T70_ClickonContinue", 5, 0, 0.0, 216.2, 134, 518, 145.0, 518.0, 518.0, 518.0, 0.6298815822625347, 1.131449396888385, 0.6772457246787604], "isController": true}, {"data": ["SignIn", 15, 0, 0.0, 185.00000000000003, 126, 290, 148.0, 287.0, 290.0, 290.0, 1.7620110419358628, 3.3457561229883708, 1.4769461044872547], "isController": false}, {"data": ["FISH", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 12.300214694656487, 3.8018845419847325], "isController": false}, {"data": ["REPTILES", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 11.879081156716417, 3.7459188432835817], "isController": false}, {"data": ["BIRDS", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 11.89365671641791, 3.724055503731343], "isController": false}]}, function(index, item){
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
