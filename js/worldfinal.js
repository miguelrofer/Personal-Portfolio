
// var balance;

var svg, projection, path, margin, width, height, coords, balance, size;



margin = {top: 0, right: 0, bottom: 0, left: 0};
width = 960 - margin.left - margin.right;
height = 500 - margin.top - margin.bottom;

path = d3.geoPath();

svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

path = d3.geoPath().projection(projection);



d3.queue()
    .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "data/tradewithworld.csv")
    .defer(d3.csv, "data/coords.csv")
    .await(ready);

function ready(error, world, b, c) {
  var balanceById = {};
  console.log(world.features);
  console.log(balance);
  balance = b;
  coords = c;
  balance.forEach(function(d) { d.Positive = +d.Positive.split(",").join("");  console.log(d.Positive);});
  balance.forEach(function(d) { d.Negative = +d.Negative.split(",").join(""); console.log(typeof d.Negative);});
  // world.features.forEach(function(d) { d.balance = balanceById[d.id] });



  size = d3.scaleLinear()
      .domain(d3.extent(balance, function(d) { return d.Positive; }))
      .range([1,45])

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(world.features)
    .enter().append("path")
      .attr("d", path)

      .style("fill", "rgb(177, 180, 177)")
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)

      // tooltips
      .style("stroke","white")
      .style('stroke-width', 0.3);

      };
      //functions for toggling between data
      function change(value){

          	if(value === 'positive'){
            	  positive();
            }else if(value === 'negative'){
            		negative();
            }
          }


  function positive(){

    console.log(coords);
    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {console.log(d.Negative);
                  return "<strong>Country: </strong><span class='details'>" + d.Country + "<br></span>" + "<strong>EU balance of trade: </strong><span class='details'>" + d.Positive + "€" +"</span>" ;
                });

    svg.call(tip);

    var circles = svg.selectAll("circle")
                .data(coords);

        circles.exit().remove();

        new_circles = circles
                .enter()
                .append("circle")
                .attr("class", "dots")

        new_circles.merge(circles)
                .attr("cx", function(d){
                    var x = [d.long, d.lat];
                    var p = projection(x);
                    return p[0];
                })
                .attr("cy", function(d){
                    var y = [d.long, d.lat];
                    var p = projection(y);
                    return p[1];
                  })
                .attr("id", function(d){
                  return d.Country;
                })
                .attr("r",
                function(d){
                    for (i = 0; i < balance.length; i++){
                      if (balance[i].code === d.code){
                        if (balance[i].Positive == 0) {
                          continue;
                        } else {

                        return size(balance[i].Positive);
                      }

                    }
                  }
                })
                .style("fill", "rgb(115, 201, 118)")
                .style("stroke", "green")
                .style("opacity", ".5")
                .style('stroke-width', 0.8)
                  // .style("stroke-opacity", .9);
                .on("mouseover", function(d) {

                  tip.show(d)
                  d3.select(this)
                        .style("opacity", .8)
                        .style("stroke","white")
                        .style("stroke-width",2)

        			   })
        			   .on("mouseout", function(d) {
                  tip.hide(d)
                  d3.select(this)
                        .style("opacity", 0.6)
                        .style("stroke","green")
                        .style("stroke-width",0.8);

              });


      };

      function negative(){
        // Set tooltips


        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                      return "<strong>Country: </strong><span class='details'>" + d.Country + "<br></span>" + "<strong>EU balance of trade: </strong><span class='details'>" + d.Negative + "€" +"</span>" ;
                     });

        svg.call(tip);

        var circles = svg.selectAll("circle")
                    .data(coords);

            circles.exit().remove();

            new_circles = circles
                    .enter()
                    .append("circle")
                    .attr("class", "dots")

            new_circles.merge(circles)
                    .attr("cx", function(d){
                        var x = [d.long, d.lat];
                        var p = projection(x);
                        return p[0];
                    })
                    .attr("cy", function(d){
                        var y = [d.long, d.lat];
                        var p = projection(y);
                        return p[1];
                      })
                    .attr("id", function(d){
                      return d.Country;
                    })
                    .attr("r",
                    function(d){
                        for (i = 0; i < balance.length; i++){
                          if (balance[i].code === d.code){
                            if (balance[i].Negative == 0) {
                              continue;
                            } else {

                            return size(balance[i].Negative);
                          }

                        }
                      }
                    })
                    .style("fill", "rgb(208, 88, 106)")
                    .style("stroke", "red")
                    .style("opacity", ".5")
                    .style('stroke-width', 0.8)
                      // .style("stroke-opacity", .9);
                    .on("mouseover", function(d) {

                      tip.show(d)
                      d3.select(this)
                            .style("opacity", .8)
                            .style("stroke","white")
                            .style("stroke-width",2)

                     })
                     .on("mouseout", function(d) {
                      tip.hide(d)
                      d3.select(this)
                            .style("opacity", 0.6)
                            .style("stroke","red")
                            .style("stroke-width",0.8);

                  });

          };
