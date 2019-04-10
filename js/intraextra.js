var width = 800;
var height = 500;
var margin = {top: 20, right: 20, bottom: 40, left: 80};

var svg = d3.select("#intraextra")
    .append('svg')
    .attr('width', width)
    .attr('height', height)

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          width = width - margin.left - margin.right;
          height = height - margin.top - margin.bottom;


var y = d3.scaleBand()
    .rangeRound([0, height])
    .padding(0.15)
    .align(0.1);

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var z = d3.scaleOrdinal()
    .range(["#7b6888", "#98abc5"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("data/intraextra.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;
console.log(data);


  var keys = data.columns.slice(1);

  y.domain(data.map(function(d) { return d.Country; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

// tooltip STARTS


var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", "4%")
  .attr("height", "5%")
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-family", "Calibri");
  // .attr("font-weight", "bold");


// tooltip ENDS





  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d[0]); })
      .attr("y", function(d) { return y(d.data.Country); })
      .attr("width", function(d) { console.log(d); return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) { console.log(d);
        var xPosition = d3.mouse(this)[0];
        var yPosition = d3.mouse(this)[1];
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(( d[1]-d[0]) + '%')
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));


  g.append("text")
      .attr("y", -5)
      .attr("x", width /3)
      .attr("dy", "0.35em")
      .attr("fill", "#7b6888")
      .style("font", "10px sans-serif")
      .style("font-size", "115%")
      .text("IntraEU exports");

  g.append("text")
      .attr("y", -5)
      .attr("x", width /1.15)
      .attr("dy", "0.35em")
      .attr("fill", "#98abc5")
      .style("font", "10px sans-serif")
      .style("font-size", "115%")
      .text("ExtraEU exports");



});
