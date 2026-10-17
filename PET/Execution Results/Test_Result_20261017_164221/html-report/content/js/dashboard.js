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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9142857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MyOrders"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [1.0, 500, 1500, "T90_GotoAccount"], "isController": true}, {"data": [1.0, 500, 1500, "UpdateCart"], "isController": false}, {"data": [1.0, 500, 1500, "T120_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "ProceedtoCheckout"], "isController": false}, {"data": [1.0, 500, 1500, "DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "T60_ProceedtoCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "T20_ProductClick"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonProduct"], "isController": false}, {"data": [1.0, 500, 1500, "GoToMyAccount"], "isController": false}, {"data": [0.9, 500, 1500, "Order Validation"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-3"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-2"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-5"], "isController": false}, {"data": [1.0, 500, 1500, "CATS"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-4"], "isController": false}, {"data": [1.0, 500, 1500, "T50_UpdateCart"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-7"], "isController": false}, {"data": [1.0, 500, 1500, "AddToCart"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-6"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-9"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-8"], "isController": false}, {"data": [0.9, 500, 1500, "Confirm"], "isController": false}, {"data": [0.4, 500, 1500, "T00_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-1"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-0"], "isController": false}, {"data": [1.0, 500, 1500, "T30_ClickonProductLink"], "isController": true}, {"data": [0.5, 500, 1500, "T10_SignIn"], "isController": true}, {"data": [0.9, 500, 1500, "T80_ConfirmOrder"], "isController": true}, {"data": [1.0, 500, 1500, "ClickonContinue"], "isController": false}, {"data": [1.0, 500, 1500, "T40_AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn-1"], "isController": false}, {"data": [1.0, 500, 1500, "SignIn-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-13"], "isController": false}, {"data": [0.0, 500, 1500, "T100_MyOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Launch-14"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-15"], "isController": false}, {"data": [0.4, 500, 1500, "Launch"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-10"], "isController": false}, {"data": [1.0, 500, 1500, "Launch-11"], "isController": false}, {"data": [0.9, 500, 1500, "Launch-12"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "T70_ClickonContinue"], "isController": true}, {"data": [1.0, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "FISH"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "BIRDS"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 0, 0.0, 635.7027027027028, 0, 14454, 146.0, 427.6, 1452.4999999999998, 13717.83999999999, 7.454867827208253, 261.832595716977, 4.973007585831722], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyOrders", 5, 0, 0.0, 13551.6, 13071, 14454, 13390.0, 14454.0, 14454.0, 14454.0, 0.25613441934327136, 296.93898357858205, 0.1268165533271861], "isController": false}, {"data": ["SignOut", 10, 0, 0.0, 203.2, 131, 287, 204.0, 285.7, 287.0, 287.0, 1.4976785981728322, 2.883031301482702, 1.0815755110828218], "isController": false}, {"data": ["T90_GotoAccount", 5, 0, 0.0, 137.4, 131, 144, 135.0, 144.0, 144.0, 144.0, 0.7803964413922273, 1.9125809661307944, 0.3962950678944904], "isController": true}, {"data": ["UpdateCart", 5, 0, 0.0, 139.6, 127, 163, 133.0, 163.0, 163.0, 163.0, 0.6145526057030481, 1.2249041682030484, 0.5116870621312685], "isController": false}, {"data": ["T120_Logout", 5, 0, 0.0, 406.4, 392, 431, 396.0, 431.0, 431.0, 431.0, 0.7490636704119851, 2.8838951310861423, 1.0818995786516854], "isController": true}, {"data": ["ProceedtoCheckout", 5, 0, 0.0, 135.6, 131, 142, 133.0, 142.0, 142.0, 142.0, 0.6282196255811031, 1.3525126821836915, 0.29999941104410105], "isController": false}, {"data": ["DOGS", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 12.28298611111111, 3.6892361111111107], "isController": false}, {"data": ["T60_ProceedtoCheckout", 5, 0, 0.0, 135.6, 131, 142, 133.0, 142.0, 142.0, 142.0, 0.6282196255811031, 1.3525126821836915, 0.29999941104410105], "isController": true}, {"data": ["T20_ProductClick", 5, 0, 0.0, 135.0, 127, 142, 135.0, 142.0, 142.0, 142.0, 0.6186587478346943, 0.9948080997896559, 0.30872521498391486], "isController": true}, {"data": ["ClickonProduct", 5, 0, 0.0, 136.0, 129, 145, 132.0, 145.0, 145.0, 145.0, 0.6173601679219657, 1.0395042983701692, 0.3268873857883689], "isController": false}, {"data": ["GoToMyAccount", 5, 0, 0.0, 137.4, 131, 144, 135.0, 144.0, 144.0, 144.0, 0.7805182641273806, 1.912879527005932, 0.3963569310021855], "isController": false}, {"data": ["Order Validation", 5, 0, 0.0, 261.2, 1, 1299, 2.0, 1299.0, 1299.0, 1299.0, 0.6611133148221605, 0.0, 0.0], "isController": false}, {"data": ["Launch-3", 5, 0, 0.0, 357.6, 142, 435, 396.0, 435.0, 435.0, 435.0, 0.6231306081754736, 1.1908853517572284, 0.249495653664008], "isController": false}, {"data": ["Launch-2", 5, 0, 0.0, 396.6, 386, 404, 398.0, 404.0, 404.0, 404.0, 0.6225099601593626, 3.968500996015936, 0.2535025911977092], "isController": false}, {"data": ["Launch-5", 5, 0, 0.0, 418.4, 399, 441, 418.0, 441.0, 441.0, 441.0, 0.6228201295465869, 0.34425409504235177, 0.2511960092800199], "isController": false}, {"data": ["CATS", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 11.321149553571427, 3.5574776785714284], "isController": false}, {"data": ["Launch-4", 5, 0, 0.0, 347.0, 135, 419, 393.0, 419.0, 419.0, 419.0, 0.6233636703652911, 0.20636746509163445, 0.2526327375015584], "isController": false}, {"data": ["T50_UpdateCart", 5, 0, 0.0, 141.2, 132, 164, 133.0, 164.0, 164.0, 164.0, 0.6144015728680265, 2.2778458312853282, 0.5115613095969526], "isController": true}, {"data": ["Launch-7", 5, 0, 0.0, 339.4, 146, 408, 376.0, 408.0, 408.0, 408.0, 0.6271951831409934, 0.4244592401530356, 0.25541053844706474], "isController": false}, {"data": ["AddToCart", 5, 0, 0.0, 139.0, 133, 146, 139.0, 146.0, 146.0, 146.0, 0.6162188809465122, 1.2243739601306383, 0.3277273462533892], "isController": false}, {"data": ["Launch-6", 5, 0, 0.0, 348.0, 130, 417, 403.0, 417.0, 417.0, 417.0, 0.6444960041247745, 0.3782637680458881, 0.2599383297886053], "isController": false}, {"data": ["Launch-9", 5, 0, 0.0, 343.2, 127, 416, 390.0, 416.0, 416.0, 416.0, 0.6233636703652911, 0.3323794570502431, 0.25202398391721725], "isController": false}, {"data": ["Launch-8", 5, 0, 0.0, 354.6, 135, 416, 408.0, 416.0, 416.0, 416.0, 0.6144015728680265, 0.3504008970262964, 0.247800634369624], "isController": false}, {"data": ["Confirm", 5, 0, 0.0, 385.0, 135, 1363, 142.0, 1363.0, 1363.0, 1363.0, 0.6490977541217707, 1.2971812930027262, 0.3175761472802804], "isController": false}, {"data": ["T00_Launch", 5, 0, 0.0, 1468.4, 1442, 1519, 1460.0, 1519.0, 1519.0, 1519.0, 0.5315190815350271, 29.007342437812266, 3.4154253481449985], "isController": true}, {"data": ["Launch-1", 5, 0, 0.0, 306.2, 134, 430, 407.0, 430.0, 430.0, 430.0, 0.6204243702692642, 1.0930132460603053, 0.24962386772552428], "isController": false}, {"data": ["Launch-0", 5, 0, 0.0, 456.4, 398, 627, 424.0, 627.0, 627.0, 627.0, 0.6020469596628537, 1.140714366345575, 0.21400888019265504], "isController": false}, {"data": ["T30_ClickonProductLink", 5, 0, 0.0, 136.0, 129, 145, 132.0, 145.0, 145.0, 145.0, 0.6173601679219657, 1.0395042983701692, 0.3268873857883689], "isController": true}, {"data": ["T10_SignIn", 5, 0, 0.0, 544.2, 512, 574, 534.0, 574.0, 574.0, 574.0, 0.5912262031453234, 3.3686036715147214, 1.486726047948445], "isController": true}, {"data": ["T80_ConfirmOrder", 5, 0, 0.0, 385.0, 135, 1363, 142.0, 1363.0, 1363.0, 1363.0, 0.6491820306413919, 1.2973497143599064, 0.31761738022591535], "isController": true}, {"data": ["ClickonContinue", 5, 0, 0.0, 196.2, 140, 413, 143.0, 413.0, 413.0, 413.0, 0.627431296273058, 1.1274156104906512, 0.6746111886685907], "isController": false}, {"data": ["T40_AddToCart", 5, 0, 0.0, 139.0, 133, 146, 139.0, 146.0, 146.0, 146.0, 0.6161429451632779, 1.2242230822550833, 0.327686960874923], "isController": true}, {"data": ["SignIn-1", 5, 0, 0.0, 135.2, 128, 143, 133.0, 143.0, 143.0, 143.0, 0.620963735717834, 1.1376249689518132, 0.37839977645305517], "isController": false}, {"data": ["SignIn-0", 5, 0, 0.0, 135.8, 131, 143, 133.0, 143.0, 143.0, 143.0, 0.6218132073125233, 0.14209403370227583, 0.5337634855739336], "isController": false}, {"data": ["SignOut-0", 5, 0, 0.0, 133.2, 128, 142, 131.0, 142.0, 142.0, 142.0, 0.7829627309740056, 0.17891921782023176, 0.3815414089414344], "isController": false}, {"data": ["SignOut-1", 5, 0, 0.0, 135.4, 132, 144, 132.0, 144.0, 144.0, 144.0, 0.781005935645111, 1.443030498281787, 0.37372354342393], "isController": false}, {"data": ["Launch-13", 5, 0, 0.0, 275.0, 141, 375, 257.0, 375.0, 375.0, 375.0, 0.6311537490532694, 0.5941720840696794, 0.2582552938020702], "isController": false}, {"data": ["T100_MyOrders", 5, 0, 0.0, 13551.6, 13071, 14454, 13390.0, 14454.0, 14454.0, 14454.0, 0.25613441934327136, 296.93898357858205, 0.1268165533271861], "isController": true}, {"data": ["Launch-14", 5, 0, 0.0, 199.4, 130, 258, 232.0, 258.0, 258.0, 258.0, 0.6259389083625438, 0.46823164434151227, 0.2542876815222834], "isController": false}, {"data": ["Launch-15", 5, 0, 0.0, 268.2, 247, 299, 264.0, 299.0, 299.0, 299.0, 0.6140997297961189, 21.8269275055269, 0.24707918816015723], "isController": false}, {"data": ["Launch", 5, 0, 0.0, 1468.4, 1442, 1519, 1460.0, 1519.0, 1519.0, 1519.0, 0.5348165579206332, 29.18730027944165, 3.436614210075944], "isController": false}, {"data": ["Launch-10", 5, 0, 0.0, 332.4, 131, 393, 379.0, 393.0, 393.0, 393.0, 0.625860558267618, 0.448614892351984, 0.25364465984478657], "isController": false}, {"data": ["Launch-11", 5, 0, 0.0, 337.4, 137, 409, 375.0, 409.0, 409.0, 409.0, 0.6244536030972898, 0.46529111246409394, 0.2530744582864993], "isController": false}, {"data": ["Launch-12", 5, 0, 0.0, 264.4, 136, 526, 237.0, 526.0, 526.0, 526.0, 0.6403688524590163, 0.43962822585809425, 0.2595244861039959], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 1.6, 0, 6, 1.0, 6.0, 6.0, 6.0, 0.629643621710112, 1.0793714976073543, 0.0], "isController": false}, {"data": ["T70_ClickonContinue", 5, 0, 0.0, 196.2, 140, 413, 143.0, 413.0, 413.0, 413.0, 0.6273525721455457, 1.1272741530740276, 0.674526544855709], "isController": true}, {"data": ["SignIn", 15, 0, 0.0, 181.40000000000003, 125, 286, 143.0, 283.6, 286.0, 286.0, 1.7732592505024234, 3.36780721716515, 1.4863745345194468], "isController": false}, {"data": ["FISH", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 12.679933562992126, 3.921628937007874], "isController": false}, {"data": ["REPTILES", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 12.173485209923664, 3.831703244274809], "isController": false}, {"data": ["BIRDS", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 11.209837147887326, 3.5142495598591554], "isController": false}]}, function(index, item){
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
