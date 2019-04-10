
console.log("try this out");

var widthEU = 900;
var heightEU = 500;
var marginEU = {top: 20, right: 60, bottom: 40, left: 60};

var svg = d3.select("#visEU")
      .append('svg')
        .attr('width', widthEU)
        .attr('height', heightEU)

var EU = svg.append("g").attr("transform", "translate(" + marginEU.left + "," + marginEU.top + ")");

      widthEU = widthEU - marginEU.left - marginEU.right;
      heightEU = heightEU - marginEU.top - marginEU.bottom;

var parseDate = d3.timeParse("%Y");

var xEU = d3.scaleTime()
    .range([0, widthEU]);

var yEU = d3.scaleLinear()
    .range([heightEU, 0]);


var lineEU = d3.area()
.curve(d3.curveCatmullRom)
.x(function(d) {
  return xEU(d.Year);
})
.y(function(d) {
    return yEU(d.Exports);
});

var areaEU = d3.area()
  .curve(d3.curveCatmullRom)
  .x(function(d) { return xEU(d.Year); })
  .y1(function(d) { return yEU(d["Exports"]); });


var lineImportEU = d3.line()
.curve(d3.curveCatmullRom)
.x(function(d) {
  return xEU(d.Year);
})
.y(function(d) {
    return yEU(d.Imports);
});

// gridlines in y axis function
function make_y_gridlinesEU() {
    return d3.axisLeft(yEU)
        .ticks(5)
}


d3.csv("data/EUtransition.csv", function(error, data) {
  if (error) throw error;
  console.log(data);

  data.forEach(function(d) {
    d.Year = parseDate(d.Year);

    d["Exports"]= +d["Exports"].split(",").join("");
    d["Imports"] = +d["Imports"].split(",").join("");
    console.log(d["Exports"]);
    console.log(typeof d["Imports"]);
    console.log(d["Imports"]);
  });

  xEU.domain(d3.extent(data, function(d) { return d.Year; }));

  yEU.domain([
    d3.min(data, function(d) { return Math.max(d["Exports"], d["Imports"]); }),
    d3.max(data, function(d) { return Math.max(d["Exports"], d["Imports"]); })
  ]);

  function transition(path) {
          path.transition()
              .duration(10000)
              .attrTween("stroke-dasharray", tweenDash);
      }
  function tweenDash() {
          var l = this.getTotalLength(),
              i = d3.interpolateString("0," + l, l + "," + l);
          return function (t) { return i(t); };
      }

  // function t(text){
  //   text.transition()
  //         .duration(2000);
  // }


  EU.datum(data);

  // add the Y gridlines
  EU.append("g")
      .attr("class", "grid")
      .call(make_y_gridlinesEU()
          .tickSize(-widthEU)
          .tickFormat(""));


  EU.append("path")
         .attr("class", "line")
         .attr("d", lineEU)
         .call(transition);


  EU.append("path")
        .attr("class", "lineImport")
        .attr("d", lineImportEU)
        .call(transition);

    var dots = EU.selectAll(".dot")
          .data(data)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", (function(d) {return xEU(d.Year);}))
          .attr("cy", (function(d) {return yEU(d.Exports);}))
          .attr("r", 3);
          // .call(transition);

    dots
       .attr('opacity', 0)
       .transition()
       .delay(10000)
       // .duration(15000)
       .attr('opacity', .9);


    var impDot = EU.selectAll(".dotimp")
            .data(data)
          .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dotimp") // Assign a class for styling
            .attr("cx", (function(d) {return xEU(d.Year);}))
            .attr("cy", (function(d) {return yEU(d.Imports);}))
            .attr("r", 3);

    impDot
          .attr('opacity', 0)
          .transition()
          .delay(10000)
          // .duration(15000)
          .attr('opacity', .9);

    xAxisEU = d3.axisBottom(xEU)
      .ticks(4)

      EU.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + heightEU + ")")
          .call(xAxisEU)
          .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(0)")
            .attr("x", widthEU)
            .attr("dy", "-0.3em")
            .attr("text-anchor", "end")
            // .call(transition)
            .text("Year");

    yAxisEU = d3.axisLeft(yEU)
      .ticks(2)

  EU.append("g")
      .attr("class", "y axis")
      .call(yAxisEU)
      .append("text")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("y", -5)
        .attr("dy", "1.8em")
        .attr("text-anchor", "end")
        // .call(transition)
        .text("Million €");

function customXAxis(g) {
          g.call(xAxisEU);
          g.select(".domain").remove();
        }

function customYAxis(g) {
          g.call(yAxisEU);
          g.select(".domain").remove();
          g.selectAll(".tick:not(:first-of-type) lineEU").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
          g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
        }

var textImp = EU.append("text")
      .attr("transform", "translate(" + (widthEU+5) + "," + yEU(data[10].Imports) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "rgb(162, 40, 65)")
      .style("font-size", "15")
      .text("Imports");

textImp
      .attr('opacity', 0)
      .transition()
      .delay(1000)
      .duration(13000)
      .attr('opacity', 1);

var textExp = EU.append("text")
        		.attr("transform", "translate(" + (widthEU+5) + "," + yEU(data[10].Exports) + ")")
        		.attr("dy", ".35em")
        		.attr("text-anchor", "start")
        		.style("fill", "rgb(40, 162, 125)")
            .style("font-size", "15")
        		.text("Exports");

textExp
    .attr('opacity', 0)
    .transition()
    .delay(1000)
    .duration(3000)
    .attr('opacity', 1);

 console.log(data);
 console.log(data[0]);



});
