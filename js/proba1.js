function differenceChart(state){

console.log(state);

var width = 300;
var height = 200;
var margin = {top: 20, right: 40, bottom: 40, left: 51.75};

var svg = d3.select("#vis"+state)
      .append('svg')
        .attr('width', width)
        .attr('height', height)

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

var area = d3.area()
  .curve(d3.curveCatmullRom)
  .x(function(d) { return x(d.Year); })
  .y1(function(d) { return y(d.Imports); })
  .y0(function(d) { return y(d.Exports); });

var area2 = d3.area()
  .curve(d3.curveCatmullRom)
  .x(function(d) { return x(d.Year); })
  .y0(function(d) { return y(d.Imports); })
  .y1(function(d) { return y(d.Exports); });


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



d3.csv("data/importexportEU.csv", function(error, data) {
  if (error) throw error;
  console.log(data);

  var countries = data.columns.slice(2).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {
          Year: d.Year,
          expenditure: d[id],
          category:d.Category
        };
      })
    };
  });

  console.log(countries);
  // var belgique =countries[0].values;


  function assign(state) {
  for (var i = 0; i < countries.length; i++) {
    if (countries[i].id === state){
      return nation = countries[i].values
    }
  }
};

// console.log(assign(nation));
  country = assign(state);
  console.log(country);


  var data = Object.values(country.reduce((r, {Year, expenditure, category}) => {
        r[Year] = r[Year] || {Year};
        r[Year][category] = expenditure;
        return r;
      },{}));
  console.log(data);


  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
    d["Exports"]= +d["Exports"].split(",").join("");
    d["Imports"] = +d["Imports"].split(",").join("");


    console.log(d.Year);
    console.log(d["Exports"]);

    console.log(d["Imports"]);
  });




  x.domain(d3.extent(data, function(d) { return d.Year; }));

  y.domain([
    d3.min(data, function(d) { return Math.min(d["Exports"], d["Imports"]); }),
    d3.max(data, function(d) { return Math.max(d["Exports"], d["Imports"]); })
  ]);


  g.datum(data);

// Add the Y gridlines
  g.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat(""));

//Append the area

  g.append("clipPath")
     .attr("id", state + "-clip-below")
   .append("path")
     .attr("d", area.y0(0));


  g.append("clipPath")
     .attr("id", state + "-clip-above")
   .append("path")
     .attr("d", area.y0(0));


g.append("path")
         .attr("class", "area below")
         .attr("clip-path", "url(#" + state + "-clip-belows)")
         .attr("d", area2);


g.append("path")
         .attr("class", "area above")
         .attr("clip-path", "url(#" + state +  "-clip-above)")
         .attr("d", area2);


// Import and Export Lines

  g.append("path")
       .attr("class", "line")
       .attr("d", line);
  g.append("path")
        .attr("class", "lineImport")
        .attr("d", lineImport);

// Appending X and Y Axis

g.append("g")
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


g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y)
      .ticks(3))
    .append("text")
      .attr("fill", "#000")
      // .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("dy", "1.8em")
      .attr("text-anchor", "end")
      .text("Million €");

var textExp = g.append("text")
        .attr("transform", "translate(" + (width+5) + "," + y(data[10].Exports) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "rgb(40, 162, 125)")
        .style("font-size", "10")
        .text("Exports");

var textImp = g.append("text")
        .attr("transform", "translate(" + (width+5) + "," + y(data[10].Imports) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "rgb(162, 40, 65)")
        .style("font-size", "10")
        .text("Imports");


// graph title
g.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 3))
      .attr("text-anchor", "middle")
      .style("font-size", "150%")
      // .style("text-decoration", "underline")
      .text( state );

});

};

differenceChart("Belgium");
differenceChart("Spain");
differenceChart("Netherlands");
differenceChart("Bulgaria");
differenceChart("Portugal");
differenceChart("Greece");
differenceChart("Malta");
differenceChart("Italy");
differenceChart("Britain");
differenceChart("France");
differenceChart("Poland");
differenceChart("Latvia");
differenceChart("Slovakia");
differenceChart("Slovenia");
differenceChart("Luxembourg");
differenceChart("Cyprus");
differenceChart("Estonia");

differenceChart("Germany");
differenceChart("Denmark");
differenceChart("Sweden");
differenceChart("Finland");
differenceChart("Romania");
differenceChart("Austria");
differenceChart("Hungary");
differenceChart("Lithuania");
differenceChart("Croatia");
differenceChart("Ireland");
differenceChart("CzechRepublic");

// differenceChart("Germany");
