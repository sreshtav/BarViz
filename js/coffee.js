var chart;
var data = {};
var vis;
data.region = {};
data.category = {};

//Gets called when the page is loaded.
function init(){
  
}

function aggregator (groupBy, attribute) {
    d3.csv("data/CoffeeData.csv", function(error, csv_data) {
      data[groupBy][attribute] = d3.nest()
        .key(function(d) { return d[groupBy];})
        .rollup(function(d) {
            return d3.sum(d, function(g) {return g[attribute]; });
        }).entries(csv_data);
        update(groupBy, attribute);
    });
}

function displayChart(groupBy, attribute) {
    if(!data[groupBy][attribute]) {
        aggregator(groupBy, attribute);
    } else {
        update(groupBy, attribute);
    }
}

function update(groupBy, attribute) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 370 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
    //Clear previous chart
    d3.select("svg").remove();
    
    chart = d3.select('#vis').append('svg')
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scale.category10()
    .domain(data[groupBy][attribute].map(function(a) {return a.key;}))
    .rangeRoundBands([0, width], .1);
    
    var xColor = d3.scale.category10()
    .domain(data[groupBy][attribute].map(function(a) {return a.key;}));
    
    var y = d3.scale.linear()
    .domain([0, d3.max(data[groupBy][attribute], function(d) { return d.values; })])
    .range([height, 0]);
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .ticks(5);
    
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis);

  chart.selectAll(".bar")
      .data(data[groupBy][attribute])
      .enter().append("rect")
      .attr("fill", function(d) { return xColor(d.key); })
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); })
      .attr("width", x.rangeBand());
    
}

//Called when the update button is clicked
function updateClicked(){
  displayChart(getXSelectedOption(), getYSelectedOption());
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}
