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

    // let totalSalaryPerGender = genderDim.group().reduceSum(dc.pluck("salary"));
        let totalSalaryPerGender = genderDim.group().reduce(
            function(p,v){
                ++p.count;
                p.total += +v["salary"];
                p.average = p.total / p.count;
                return p;
            },
            function(p,v){
                --p.count;
                if(p.count == 0){
                    p.total = 0
                    p.average = 0
                } else {
                    p.total -= v["salary"];
                    p.average = p.total / p.count;
                }
                return p;
            },
            function() {
                return { count: 0, total: 0, average: 0 };
            }
        );
    let salaryChartPerGender = dc.barChart("#male-female-salary");
    
    salaryChartPerGender
    .height(500)
    .width(500)
    .dimension(genderDim)
    .group(totalSalaryPerGender)
    .valueAccessor(function(p){
        return p.value.average;
    })
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Gender");
    
    let serviceDim = ndx.dimension(function(d) {
        return +d["yrs.service"];
    });
    // let salaryPerService = serviceDim.group().reduceSum(dc.pluck("salary"));
    let salaryPerService = serviceDim.group().reduce(
            function(p,v){
                ++p.count;
                p.total += +v["salary"];
                p.average = p.total / p.count;
                return p;
            },
            function(p,v){
                --p.count;
                if(p.count == 0){
                    p.total = 0
                    p.average = 0
                } else {
                    p.total -= v["salary"];
                    p.average = p.total / p.count;
                }
                return p;
            },
            function() {
                return { count: 0, total: 0, average: 0 };
            }
        );    
    let salaryChartPerService = dc.lineChart("#salary-per-service");
    
    salaryChartPerService
    .width(1000)
    .height(300)
    .dimension(serviceDim)
    .group(salaryPerService)
    .valueAccessor(function(p){
        return p.value.average;
    })
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Years of Service")
    .yAxis().ticks(8);
    
    
    // let yrsSincePhd = ndx.dimension(dc.pluck("yrs.since.phd"));
    let yrsSincePhd = ndx.dimension(function(d){
        return +d["yrs.since.phd"];
    });
    
    let profSalary = yrsSincePhd.group().reduceSum(function(d){
        if(d.rank === "Prof"){
            return + d.salary
        } else {
            return 0;
        }
    });
    
    let asstProfSalary = yrsSincePhd.group().reduceSum(function(d){
        if(d.rank === "AsstProf"){
            return + d.salary
        } else {
            return 0;
        }
    });
    
    let assocProfSalary = yrsSincePhd.group().reduceSum(function(d){
        if(d.rank === "AssocProf"){
            return + d.salary
        } else {
            return 0;
        }
    });
    
    let totalSalary = yrsSincePhd.group().reduce(
            function(p,v){
                ++p.count;
                p.total += +v["salary"];
                p.average = p.total / p.count;
                return p;
            },
            function(p,v){
                --p.count;
                if(p.count == 0){
                    p.total = 0
                    p.average = 0
                } else {
                    p.total -= v["salary"];
                    p.average = p.total / p.count;
                }
                return p;
            },
            function() {
                return { count: 0, total: 0, average: 0 };
            }
        );
    
    let compositeChart = dc.compositeChart("#salary-per-phd-per-profession");
    
    compositeChart
    .width(1000)
    .height(300)
    .dimension(yrsSincePhd)
    .group(totalSalary)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .yAxisLabel("Salary")
    .valueAccessor(function(p){
        return p.value.average;
    })
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(compositeChart)
        .colors("green")
        .group(profSalary, "Prof"),
        dc.lineChart(compositeChart)
        .colors("red")
        .group(asstProfSalary, "Asst Prof"),
        dc.lineChart(compositeChart)
        .colors("blue")
        .group(assocProfSalary, "Assoc Prof"),
        ])
    .render()
    .yAxis().ticks(4);
    
    let manSalary = yrsSincePhd.group().reduceSum(function(d){
        if(d.sex === "Male"){
            return + d.salary
        } else {
            return 0;
        }
    });
    
    let femaleSalary = yrsSincePhd.group().reduceSum(function(d){
        if(d.sex === "Female"){
            return + d.salary
        } else {
            return 0;
        }
    });
    
    
    let compositeChart2 = dc.compositeChart("#salary-per-gender-per-profession");
    
    compositeChart2
    .width(1000)
    .height(300)
    .dimension(yrsSincePhd)
    .group(totalSalary)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .yAxisLabel("Salary")
    .valueAccessor(function(p){
        return p.value.average;
    })
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(compositeChart)
        .colors("green")
        .group(manSalary, "Man"),
        dc.lineChart(compositeChart)
        .colors("red")
        .group(femaleSalary, "Woman")
        ])
    .render()
    .yAxis().ticks(4);
    
    dc.renderAll();

}