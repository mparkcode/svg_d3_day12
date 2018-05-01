queue()
  .defer(d3.json, "data/transactions.json")
  .await(makeGraph);

function makeGraph(error, transactionsData) {
  let ndx = crossfilter(transactionsData);

  let parseDate = d3.time.format("%d/%m/%Y").parse;

  transactionsData.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  let dateDim = ndx.dimension(dc.pluck("date"));

  let minDate = dateDim.bottom(1)[0].date;
  let maxDate = dateDim.top(1)[0].date;

  let nameDim = ndx.dimension(dc.pluck("name"));
  let spendGroup = nameDim.group().reduceSum(dc.pluck("spend"));
  
  let spendChart = dc.barChart("#spend-chart");
  
  spendChart
  .width(500)
  .height(300)
  .dimension(nameDim)
  .group(spendGroup)
  .x(d3.scale.ordinal())
  .xUnits(dc.units.ordinal)
  .xAxisLabel("Person");
  
  dc.renderAll();

}