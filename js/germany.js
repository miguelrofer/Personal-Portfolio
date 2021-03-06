function germany(){

var width = 300;
var height = 200;
var margin = {top: 20, right: 40, bottom: 40, left: 60};

var svg = d3.select("#visGermany")
      .append('svg')
        .attr('width', width)
        .attr('height', height)

var Country = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);


var line = d3.area()
.curve(d3.curveCatmullRom)
.x(function(d) {
  return x(d.Year);
})
.y(function(d) {
    return y(d.Exports);
});

var areaGermany = d3.area()
  .curve(d3.curveCatmullRom)
  .x(function(d) { return x(d.Year); })
  .y1(function(d) { return y(d["Exports"]); });


var lineImport = d3.line()
.curve(d3.curveCatmullRom)
.x(function(d) {
  return x(d.Year);
})
.y(function(d) {
    return y(d.Imports);
});

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5)
}


d3.csv("data/GermanyExample.csv", function(error, data) {
  if (error) throw error;
  console.log(data);

  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
    d["Exports"]= +d["Exports"].split(",").join("");
    d["Imports"] = +d["Imports"].split(",").join("");


    console.log(typeof d["Exports"]);
    console.log(d["Exports"]);
    console.log(typeof d["Imports"]);
    console.log(d["Imports"]);
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));

  y.domain([
    d3.min(data, function(d) { return Math.min(d["Exports"], d["Imports"]); }),
    d3.max(data, function(d) { return Math.max(d["Exports"], d["Imports"]); })
  ]);



  Country.datum(data);

  // add the Y gridlines
  Country.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat(""));

  Country.append("clipPath")
     .attr("id", "clip-below")
   .append("path")
     .attr("d", areaGermany.y0(height));

 Country.append("clipPath")
     .attr("id", "clip-above")
   .append("path")
     .attr("d", areaGermany.y0(0));

 Country.append("path")
     .attr("class", "area above")
     .attr("clip-path", "url(#clip-above)")
     .attr("d", areaGermany.y0(function(d) { return y(d["Imports"]); }));

 Country.append("path")
     .attr("class", "area below")
     .attr("clip-path", "url(#clip-below)")
     .attr("d", areaGermany.y0(function(d) { return y(d["Imports"]); }));

 Country.append("path")
     .attr("class", "line")
     .attr("d", line);

 Country.append("path")
      .attr("class", "lineImport")
      .attr("d", lineImport);

  Country.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(d3.axisBottom(x)
        .ticks(4))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(0)")
        .attr("x", width)
        .attr("dy", "-0.3em")
        .attr("text-anchor", "end")
        .text("Year");


  Country.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y)
        .ticks(3))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -5)
        .attr("dy", "1.8em")
        .attr("text-anchor", "end")
        .text("Million €");

// graph title
  Country.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "150%")
              // .style("text-decoration", "underline")
        .text("Germany");

});

};

germany();
