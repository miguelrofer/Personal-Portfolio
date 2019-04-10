// The svg
var width = 960;
var height = 600;
var margin = {top: 20, right: 40, bottom: 40, left: 50};

var svg = d3.select("#visWorld")
      .append('svg')
        .attr('width', width)
        .attr('height', height)

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale((width - 3) / (2 * Math.PI))
    .translate([width / 2, height / 2]);
var path = d3.geoPath()
    .projection(projection);
console.log("hello");
// Data and color scale
var data = d3.map();
var colorScheme = ["#ffd700",
"#ffb14e",
"#fa8775",
"#ea5f94",
"#cd34b5",
"#9d02d7",
"#0000ff"];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([1, 6, 11, 26, 101, 1001])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Students");
var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "mooc-countries.csv", function(d) { data.set(d.code, +d.total); })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;

    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
            .attr("fill", function (d){
                // Pull data for this country
                d.total = data.get(d.id) || 0;
                // Set the color
                return colorScale(d.total);
            })
            .attr("d", path);
}
