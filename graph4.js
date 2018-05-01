queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let genderDim = ndx.dimension(dc.pluck("sex"));
    
    let genderGroup = genderDim.group();
    
    let genderChart = dc.pieChart("#male-female-split");
    
    genderChart
    .height(300)
    .radius(100)
    .dimension(genderDim)
    .group(genderGroup);

    let totalSalaryPerGender = genderDim.group().reduceSum(dc.pluck("salary"));
    
    let salaryChartPerGender = dc.barChart("#male-female-salary");
    
    salaryChartPerGender
    .height(500)
    .width(500)
    .dimension(genderDim)
    .group(totalSalaryPerGender)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Gender");
    
    let serviceDim = ndx.dimension(function(d) {
        return +d["yrs.service"];
    });
    let salaryPerService = serviceDim.group().reduceSum(dc.pluck("salary"));
    
    let salaryChartPerService = dc.lineChart("#salary-per-service");
    
    salaryChartPerService
    .width(1000)
    .height(300)
    .dimension(serviceDim)
    .group(salaryPerService)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Years of Service")
    .yAxis().ticks(8);
    
    
    dc.renderAll();

}