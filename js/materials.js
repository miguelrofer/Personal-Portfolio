// Load and munge data, then make the visualization.
            var materialFields = ["Food", "Raw", "Mineral", "Chemicals", "Other",
                                   "Machinery", "Commodities"];

            console.log(materialFields[0]);
            console.log(materialFields.length-1);

            var tip = d3.tip()
            .attr('class', 'd3-tipinho')
            .offset([-10, 0])
            .html(function(d) {
              if (d>0){
              return "<strong>Trade Balance:</strong> <span style='color:green'>" + d + "€"+ "</span>" ;
            }else{
              return "<strong>Trade Balance:</strong> <span style='color:red'>" + d + "€"+ "</span>" ;
              }
            })

            d3.csv("data/materials.csv", function(error, data) {
                console.log(data);
                var CountryMap = {};
                data.forEach(function(d) {
                    var Country = d.Country;
                    CountryMap[Country] = [];


                    materialFields.forEach(function(field) {
                        CountryMap[Country].push( +d[field] );
                    });
                });
                makeVis(CountryMap);
            });

            var makeVis = function(CountryMap) {
                // Define dimensions of vis
                var margin = { top: 30, right: 50, bottom: 30, left: 50 },
                    width  = 650 - margin.left - margin.right,
                    height = 400 - margin.top  - margin.bottom;

                // Make x scale
                var xScale = d3.scaleBand()
                    .domain(materialFields)
                    .range([0, width], 0.1)
                    .padding(0.3)
                    .align(0.3);

                // Make y scale, the domain will be defined on bar update
                var yScale = d3.scaleLinear()
                    .range([height, 0]);


                // Create canvas
                var canvas = d3.select("#vis-container")
                  .append("svg")
                    .attr("width",  width  + margin.left + margin.right)
                    .attr("height", height + margin.top  + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Make x-axis and add to canvas
                var xAxis = d3.axisBottom(xScale);


                canvas.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Make y-axis and add to canvas
                var yAxis = d3.axisLeft(yScale);

                var yAxisHandleForUpdate = canvas.append("g")
                    .attr("class", "y axis");
                    //.call(yAxis);

                    yAxisHandleForUpdate
                    .append("text")
                      .attr("fill", "black")
                      // .attr("transform", "rotate(-90)")
                      .attr("y", -30)
                      .attr("dy", "1.8em")
                      .attr("text-anchor", "end")
                      .text("Million €");

                yAxisHandleForUpdate.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Million €");

                canvas.call(tip);

                var updateBars = function(data) {
                    // First update the y-axis domain to match data
                    yScale.domain(d3.extent(data) );
                    console.log(d3.extent(data));
                    //yAxisHandleForUpdate.call(yAxis);

                    var bars = canvas.selectAll(".bar").data(data);

                    // Add bars for new data
                    bars.enter()
                      .append("rect")
                      .attr("class", function(d) { console.log(d);
                            if (d < 0){
                                return "bar negative";
                            } else {
                                return "bar positive";
                            }
                        })
                        .attr("x", function(d,i) { return xScale( materialFields[i] ); })
                        .attr("width", xScale.bandwidth())
                        .attr("y", function(d) {
                              if (d > 0){
                                  return yScale(d);
                              } else {
                                  return yScale(0);
                              }
                          })
                        .attr("height", function(d,i) { return Math.abs(yScale(d) - yScale(0)) })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    // Update old ones, already have x / width from before
                    bars
                        .transition().duration(250)
                        .attr("class", function(d) { console.log(d);
                              if (d < 0){
                                  return "bar negative";
                              } else {
                                  return "bar positive";
                              }
                          })
                        .attr("y", function(d) {
                              if (d > 0){
                                  return yScale(d);
                              } else {
                                  return yScale(0);
                              }
                          })
                          .attr("height", function(d,i) { return Math.abs(yScale(d) - yScale(0)) });

                    // Remove old ones
                    bars.exit().remove();

                    yAxisHandleForUpdate.transition().call(yAxis);
                };

                // Handler for dropdown value change
                var dropdownChange = function() {
                    var newCountry = d3.select(this).property('value'),
                        newData   = CountryMap[newCountry];

                    updateBars(newData);
                };

                // Get names of cereals, for dropdown
                var countries = Object.keys(CountryMap).sort();

                var dropdown = d3.select("#vis-container")
                    .insert("select", "svg")
                    .on("change", dropdownChange);

                dropdown.selectAll("option")
                    .data(countries)
                  .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                    });

                var initialData = CountryMap[ countries[0] ];
                updateBars(initialData);
            };
