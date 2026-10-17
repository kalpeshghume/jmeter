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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8367346938775511, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MyOrders"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [1.0, 500, 1500, "T90_GotoAccount"], "isController": true}, {"data": [0.9, 500, 1500, "UpdateCart"], "isController": false}, {"data": [0.9, 500, 1500, "T120_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "T60_ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [1.0, 500, 1500, "GoToMyAccount"], "isController": false}, {"data": [0.9, 500, 1500, "Order Validation"], "isController": false}, {"data": [0.8, 500, 1500, "Launch-3"], "isController": false}, {"data": [0.7, 500, 1500, "Launch-2"], "isController": false}, {"data": [0.7, 500, 1500, "Launch-5"], "isController": false}, {"data": [1.0, 500, 1500, "CATS"], "isController": false}, {"data": [0.7, 500, 1500, "Launch-4"], "isController": false}, {"data": [0.9, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [0.8, 500, 1500, "Launch-7"], "isController": false}, {"data": [0.9, 500, 1500, "AddToCart"], "isController": false}, {"data": [0.7, 500, 1500, "Launch-6"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-9"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-8"], "isController": false}, {"data": [0.7, 500, 1500, "Confirm"], "isController": false}, {"data": [0.1, 500, 1500, "T00_Launch"], "isController": true}, {"data": [0.9, 500, 1500, "Launch-1"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-0"], "isController": false}, {"data": [1.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.5, 500, 1500, "T10_SignIn"], "isController": true}, {"data": [0.7, 500, 1500, "T80_ConfirmOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonContinue"], "isController": false}, {"data": [0.9, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn-1"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-1"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-13"], "isController": false}, {"data": [0.0, 500, 1500, "T100_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-14"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-15"], "isController": false}, {"data": [0.1, 500, 1500, "Launch"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-10"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-11"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-12"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "T70_ClickonContinue"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "FISH"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "BIRDS"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 0, 0.0, 680.0756756756759, 0, 14485, 203.0, 623.0, 1513.5, 13741.959999999988, 7.175548832518811, 252.08349999515167, 4.786678932976495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyOrders", 5, 0, 0.0, 13551.6, 12812, 14485, 13453.0, 14485.0, 14485.0, 14485.0, 0.25588536335721596, 296.73346340839305, 0.12669324142784033], "isController": false}, {"data": ["SignOut", 10, 0, 0.0, 220.9, 131, 361, 234.0, 353.40000000000003, 361.0, 361.0, 1.371742112482853, 2.6380583419067216, 0.9906282150205761], "isController": false}, {"data": ["T90_GotoAccount", 5, 0, 0.0, 137.6, 133, 141, 138.0, 141.0, 141.0, 141.0, 0.7950389569088886, 1.9469137581491494, 0.403730720305295], "isController": true}, {"data": ["UpdateCart", 5, 0, 0.0, 213.0, 130, 513, 140.0, 513.0, 513.0, 513.0, 0.6872852233676976, 1.370274914089347, 0.5722454896907216], "isController": false}, {"data": ["T120_Logout", 5, 0, 0.0, 441.8, 395, 565, 416.0, 565.0, 565.0, 565.0, 0.6859651529702291, 2.6384202651255317, 0.9907641223075868], "isController": true}, {"data": ["ProceedtoCheckout", 5, 0, 0.0, 138.2, 133, 142, 137.0, 142.0, 142.0, 142.0, 0.7439369141496801, 1.6012079675643505, 0.3552589365421812], "isController": false}, {"data": ["DOGS", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 8.552472615979381, 2.5672519329896906], "isController": false}, {"data": ["T60_ProceedtoCheckout", 5, 0, 0.0, 138.2, 133, 142, 137.0, 142.0, 142.0, 142.0, 0.7439369141496801, 1.6012079675643505, 0.3552589365421812], "isController": true}, {"data": ["T20_ProductClick", 5, 0, 0.0, 161.4, 131, 201, 141.0, 201.0, 201.0, 201.0, 0.6758583400919167, 1.086653487429035, 0.33726915213571235], "isController": true}, {"data": ["ClickonProduct", 5, 0, 0.0, 162.6, 131, 203, 140.0, 203.0, 203.0, 203.0, 0.6817562039814562, 1.147800484046905, 0.3609845837878375], "isController": false}, {"data": ["GoToMyAccount", 5, 0, 0.0, 137.6, 133, 141, 138.0, 141.0, 141.0, 141.0, 0.794912559618442, 1.94660423290938, 0.40366653418124004], "isController": false}, {"data": ["Order Validation", 5, 0, 0.0, 271.6, 1, 1318, 2.0, 1318.0, 1318.0, 1318.0, 0.6696129637069774, 0.0, 0.0], "isController": false}, {"data": ["Launch-3", 5, 0, 0.0, 433.2, 135, 623, 422.0, 623.0, 623.0, 623.0, 0.6524859715516117, 1.2469873499282265, 0.261249265953282], "isController": false}, {"data": ["Launch-2", 5, 0, 0.0, 465.4, 129, 625, 544.0, 625.0, 625.0, 625.0, 0.6754931099702783, 4.306268576060524, 0.2750787371656309], "isController": false}, {"data": ["Launch-5", 5, 0, 0.0, 517.8, 409, 623, 547.0, 623.0, 623.0, 623.0, 0.6504488096786782, 0.35952541628723816, 0.26233921718485753], "isController": false}, {"data": ["CATS", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 12.098938454198473, 3.8018845419847325], "isController": false}, {"data": ["Launch-4", 5, 0, 0.0, 459.4, 124, 623, 549.0, 623.0, 623.0, 623.0, 0.6512112529304507, 0.2155865378353738, 0.2639186230138057], "isController": false}, {"data": ["T50_UpdateCart", 5, 0, 0.0, 214.6, 130, 519, 141.0, 519.0, 519.0, 519.0, 0.6872852233676976, 2.5485932130584192, 0.5722454896907216], "isController": true}, {"data": ["Launch-7", 5, 0, 0.0, 423.2, 208, 553, 432.0, 553.0, 553.0, 553.0, 0.6555657532450505, 0.44365924511603516, 0.26696378818670513], "isController": false}, {"data": ["AddToCart", 5, 0, 0.0, 242.4, 131, 602, 140.0, 602.0, 602.0, 602.0, 0.6874742197167606, 1.3664892839956002, 0.3656234961501444], "isController": false}, {"data": ["Launch-6", 5, 0, 0.0, 517.2, 407, 623, 535.0, 623.0, 623.0, 623.0, 0.6511264487563485, 0.3821552692407865, 0.2626125227894257], "isController": false}, {"data": ["Launch-9", 5, 0, 0.0, 381.0, 132, 649, 374.0, 649.0, 649.0, 649.0, 0.6628662335940607, 0.35344234720933315, 0.26799474678509877], "isController": false}, {"data": ["Launch-8", 5, 0, 0.0, 358.2, 132, 512, 370.0, 512.0, 512.0, 512.0, 0.6522306287503261, 0.37197528045917033, 0.263057861009653], "isController": false}, {"data": ["Confirm", 5, 0, 0.0, 589.8, 132, 1510, 148.0, 1510.0, 1510.0, 1510.0, 0.6580679126085812, 1.3145934785469862, 0.3219648673993156], "isController": false}, {"data": ["T00_Launch", 5, 0, 0.0, 1744.4, 1399, 2039, 1881.0, 2039.0, 2039.0, 2039.0, 0.5357908272610373, 29.239842577957564, 3.442874651735962], "isController": true}, {"data": ["Launch-1", 5, 0, 0.0, 346.4, 186, 543, 382.0, 543.0, 543.0, 543.0, 0.6531678641410843, 1.1506980731548007, 0.2627980078380144], "isController": false}, {"data": ["Launch-0", 5, 0, 0.0, 503.6, 383, 840, 419.0, 840.0, 840.0, 840.0, 0.6081245439065921, 1.151517080698127, 0.2161692714667964], "isController": false}, {"data": ["T30_ClickonProductLink", 5, 0, 0.0, 162.6, 131, 203, 140.0, 203.0, 203.0, 203.0, 0.6815703380588877, 1.1474875613413305, 0.3608861692339149], "isController": true}, {"data": ["T10_SignIn", 5, 0, 0.0, 578.6, 530, 641, 557.0, 641.0, 641.0, 641.0, 0.6325910931174089, 3.6042865953947367, 1.5907442038841093], "isController": true}, {"data": ["T80_ConfirmOrder", 5, 0, 0.0, 589.8, 132, 1510, 148.0, 1510.0, 1510.0, 1510.0, 0.6579813133307014, 1.314420482958284, 0.32192249802605605], "isController": true}, {"data": ["ClickonContinue", 5, 0, 0.0, 161.2, 137, 244, 142.0, 244.0, 244.0, 244.0, 0.7439369141496801, 1.338214644398155, 0.7998774828894509], "isController": false}, {"data": ["T40_AddToCart", 5, 0, 0.0, 242.4, 131, 602, 140.0, 602.0, 602.0, 602.0, 0.6874742197167606, 1.3664892839956002, 0.3656234961501444], "isController": true}, {"data": ["SignIn-1", 5, 0, 0.0, 146.8, 132, 182, 140.0, 182.0, 182.0, 182.0, 0.6662225183211192, 1.2202802298467688, 0.40597934710193206], "isController": false}, {"data": ["SignIn-0", 5, 0, 0.0, 134.2, 129, 140, 134.0, 140.0, 140.0, 140.0, 0.6672894701721607, 0.15248607033231015, 0.5728002385559856], "isController": false}, {"data": ["SignOut-0", 5, 0, 0.0, 143.6, 132, 155, 139.0, 155.0, 155.0, 155.0, 0.7268498328245384, 0.16609654382904493, 0.35419733064398895], "isController": false}, {"data": ["SignOut-1", 5, 0, 0.0, 150.6, 131, 205, 139.0, 205.0, 205.0, 205.0, 0.7212925562608195, 1.3307284153202539, 0.34514975836699363], "isController": false}, {"data": ["Launch-13", 5, 0, 0.0, 206.6, 124, 505, 135.0, 505.0, 505.0, 505.0, 0.6802721088435374, 0.6404124149659864, 0.2783535289115646], "isController": false}, {"data": ["T100_MyOrders", 5, 0, 0.0, 13551.6, 12812, 14485, 13453.0, 14485.0, 14485.0, 14485.0, 0.2558722685635331, 296.71827823550484, 0.12668675797042117], "isController": true}, {"data": ["Launch-14", 5, 0, 0.0, 132.8, 122, 138, 135.0, 138.0, 138.0, 138.0, 0.6758583400919167, 0.5055737192484455, 0.2745674506623412], "isController": false}, {"data": ["Launch-15", 5, 0, 0.0, 345.2, 248, 599, 271.0, 599.0, 599.0, 599.0, 0.6567713122290818, 23.343602226454745, 0.2642478326546696], "isController": false}, {"data": ["Launch", 5, 0, 0.0, 1744.4, 1399, 2039, 1881.0, 2039.0, 2039.0, 2039.0, 0.5415357955160836, 29.553364121899705, 3.4797905610310838], "isController": false}, {"data": ["Launch-10", 5, 0, 0.0, 363.6, 124, 510, 405.0, 510.0, 510.0, 510.0, 0.6651589729945457, 0.4767838732206997, 0.2695712634694692], "isController": false}, {"data": ["Launch-11", 5, 0, 0.0, 358.4, 125, 510, 383.0, 510.0, 510.0, 510.0, 0.6663113006396588, 0.49648000233208955, 0.27003827125533053], "isController": false}, {"data": ["Launch-12", 5, 0, 0.0, 379.8, 139, 510, 434.0, 510.0, 510.0, 510.0, 0.6600660066006601, 0.4531507838283828, 0.26750721947194717], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 1.5999999999999999, 0, 6, 1.0, 6.0, 6.0, 6.0, 0.7498500299940013, 1.285582727204559, 0.0], "isController": false}, {"data": ["T70_ClickonContinue", 5, 0, 0.0, 161.2, 137, 244, 142.0, 244.0, 244.0, 244.0, 0.7439369141496801, 1.338214644398155, 0.7998774828894509], "isController": true}, {"data": ["SignIn", 15, 0, 0.0, 192.86666666666667, 126, 312, 140.0, 292.8, 312.0, 312.0, 1.8972931950417407, 3.603374810270681, 1.5903417894636984], "isController": false}, {"data": ["FISH", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 8.011699315920398, 2.477845149253731], "isController": false}, {"data": ["REPTILES", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 11.275487588652483, 3.559951241134752], "isController": false}, {"data": ["BIRDS", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 11.390904017857142, 3.5644531249999996], "isController": false}]}, function(index, item){
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
