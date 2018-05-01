queue()
.defer(d3.json, "data/transactions.json")
.await(makeGraph);

function makeGraph(error, transactionsData){
    let ndx = crossfilter(transactionsData);
    
    let parseDate = d3.time.format("%d/%m/%Y").parse;
    
    transactionsData.forEach(function(d){
        d.date = parseDate(d.date);
    });
    
    let dateDim = ndx.dimension(dc.pluck('date'));
    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;
    
    let tomSpend = dateDim.group().reduceSum(function(d){
        if (d.name === "Tom"){
            return + d.spend;
        } else {
            return 0;
        }
    });
    
    let aliceSpend = dateDim.group().reduceSum(function(d){
        if (d.name === "Alice"){
            return + d.spend;
        } else {
            return 0;
        }
    });
    
    let bobSpend = dateDim.group().reduceSum(function(d){
        if (d.name === "Bob"){
            return + d.spend;
        } else {
            return 0;
        }
    });
    
    let nySpend = dateDim.group().reduceSum(function(d){
        if(d.state === "NY"){
            return d.spend;
        } else {
            return 0;
        }
    });
    
    let flSpend = dateDim.group().reduceSum(function(d){
        if(d.state === "FL"){
            return d.spend;
        } else {
            return 0;
        }
    });
    
    let caSpend = dateDim.group().reduceSum(function(d){
        if(d.state === "CA"){
            return d.spend;
        } else {
            return 0;
        }
    });
    
    let tnSpend = dateDim.group().reduceSum(function(d){
        if(d.state === "TN"){
            return d.spend;
        } else {
            return 0;
        }
    });
    
    let wiSpend = dateDim.group().reduceSum(function(d){
        if(d.state === "WI"){
            return d.spend;
        } else {
            return 0;
        }
    });
    
    let compositeChart = dc.compositeChart("#composite-chart");
    
    compositeChart
    .width(1000)
    .height(200)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .yAxisLabel('spend')
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(compositeChart)
        .colors("green")
        .group(tomSpend, "Tom"),
        dc.lineChart(compositeChart)
        .colors("red")
        .group(bobSpend, "Bob"),
        dc.lineChart(compositeChart)
        .colors("blue")
        .group(aliceSpend, "Alice")
    ])
    .render()
    .yAxis().ticks(4);
    
    let stateCompositeChart = dc.compositeChart('#state-composite-chart');
    
    stateCompositeChart
    .width(1000)
    .height(200)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .yAxisLabel('state')
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(compositeChart)
        .colors("green")
        .group(nySpend, "NY"),
        dc.lineChart(compositeChart)
        .colors('red')
        .group(flSpend, "FL"),
        dc.lineChart(compositeChart)
        .colors("blue")
        .group(caSpend, "CA"),
        dc.lineChart(compositeChart)
        .colors("orange")
        .group(tnSpend, "TN"),
        dc.lineChart(compositeChart)
        .colors("yellow")
        .group(wiSpend, "WI")
    ])
    .render()
    .yAxis().ticks(4);
    
    let storeDim = ndx.dimension(dc.pluck('store'));
    let totalSpendByStore = storeDim.group().reduceSum(dc.pluck('spend'));
            
    let storeChart = dc.pieChart("#store-chart");
            
    storeChart
        .height(300)
        .radius(100)
        .dimension(storeDim)
        .group(totalSpendByStore);
                
    let totalSpendPerDate = dateDim.group().reduceSum(dc.pluck('spend'));
    
    let dateSpendChart = dc.barChart("#date-spend-chart");
    
    dateSpendChart
        .height(200)
        .width(1100)
        .dimension(dateDim)
        .group(totalSpendPerDate)
        .x(d3.time.scale().domain([minDate,maxDate]))
        // .xUnits(function() { return 50;})
        .xAxisLabel("date")
        .yAxis().ticks(4);
        
    dc.renderAll();
    
}