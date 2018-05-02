queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let yearDim = ndx.dimension(dc.pluck("yrs.service"));
    let salaryPerYear = yearDim.group().reduceSum(dc.pluck("salary"));
    
    let salaryPerYearChart = dc.scatterPlot("#salary_against_years_service");
    
    salaryPerYearChart
    .width(1000)
    .height(300)
    .dimension(yearDim)
    .group(salaryPerYear)
    .x(d3.scale.ordinal())
    // .xUnits(dc.units.ordinal)
    .xAxisLabel("Years of service");
    salaryPerYearChart.yAxis().ticks(5);
    
    dc.renderAll();

}