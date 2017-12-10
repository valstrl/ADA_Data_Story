var m_width = $("#map").width(),
    width = 938,
    height = 500,
    //kantone, // Alle Kantone der Schweiz
    //bezirke, // Alle Bezirke der Schweiz
    gemeinden, // Alle Gemeinden der Scheiz
    //kanton, // Ausgewählter Kanton
    //bezirk, // Ausgewählter Bezitk
    dataset;

//highlight when mouseover
var highlight = function() {
    d3.select(this)
    .classed("highlighted", false);
}

//colorscale
var color = d3.scale.quantize()
.range(["#74c476","#41ab5d","#238b45"]);

//projection
var projection = d3.geo.conicConformal()
    .scale(150)
    .translate([width / 2, height / 1.5]);
//path
var path = d3.geo.path()
    .projection(projection);

//SVG for map
var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    //.on("click", move_up)
    .on("mouseover", function() {

            d3.select("#title").text("Select a canton");
            d3.select("#value").text("Click on a canton to zoom on it and see its municipalities");

    });

//SVP group (cantons or municipalities)
var g = svg.append("g");

//set color for value
var get_place_color = function(d) {
    //Get data value
    if (d.munip_votes) {
                            var value = d.munip_votes;
                        }
                        else {
                            var value = 0;
                        }
    if (value ) {
            //If value exists…
            return color(value); // color = color scale
    } else {
            //If value is undefined…
            return "#a1d99b";
    }
};

//write the value for cantons (when clicked or mouseover) and municipalities (mouseover)
var update_info = function(d) {

    if (d.munip_votes) {
        var value = d.munip_votes;
    }
    else {
        var value = 0;
    }

  d3.select(this).classed("highlighted", true);

var name;
  if(d.properties.KTNAME) {
    name = d.properties.KTNAME;
  }
  else if(d.properties.GMDNAME) {
    name = d.properties.GMDNAME;
  }
  d3.select("#title").text(name);
  d3.select("#value").text(" Value:" +value );

}

//set max and min of value to a color to generate a color domain
function set_colordomain(d) {
    color.domain([
                    d3.min(d, function(d) {
                        if (d.munip_votes) {
                            return d.munip_votes;
                        }
                        else {
                            return 0;
                        }
                    }),
                    d3.max(d, function(d) {
                        if (d.munip_votes) {
                            return d.munip_votes;
                        }
                        else {
                            return 0;
                        }
                    })
    ]);
    d3.select("#range0").text("0");
    d3.select("#range1").text("0 - "+Math.round(color.invertExtent("#74c476")[1]));
    d3.select("#range2").text(Math.round(color.invertExtent("#41ab5d")[1])+" - "+Math.round(color.invertExtent("#41ab5d")[1]));
    d3.select("#range3").text(Math.round(color.invertExtent("#238b45")[1])+" - "+Math.round(color.invertExtent("#238b45")[1]));
}


function zoom(xyz) {
g.selectAll([ "#gemeinden"])
    .style("stroke-width", 1.0 / xyz[2] + "px");

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll([ "#gemeinden"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".gemeinde")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}


function start_demo() {

  gemeinden.forEach(function(d) {
                var munip_data = dataset.filter( function(data) {

                    return data.Name == d.properties.GMDNAME;
                });


        		d.munip_votes = munip_data[0].Score;

        	});


  set_colordomain(gemeinden);

  g.append("g")
    .attr("id", "gemeinden")
    .selectAll("path")
    .data(gemeinden)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("class", "gemeinde")
    .attr("d", path)
    .attr("fill", get_place_color)
    //.on("click", kanton_clicked_gemeinden)
  .on("mouseover", update_info)
  .on("mouseout", highlight);



  d3.json("data/topojson/start.json", function(error, json) {
  start = get_xyz((json.features)[0]);
  zoom(start);
    //g.selectAll( "#gemeinden").remove();
    });

};

$(window).resize(function() {
  var w = $("#map").width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});

d3.csv("data/votes/SVP_UDC.csv", function(data) {

dataset = data;
            d3.select("#value").text("Load municipalities");

            // Lade Gemeinden
            d3.json("data/topojson/gemeinden.topo.json", function(error, json) {
                  gemeinden = topojson.feature(json, json.objects.gemeinden).features;

                  d3.select("#title").text("Select a canton");
                  d3.select("#value").text("Click on a canton to zoom on it and see its municipalities");
                  //Starte die Demonstration
                  start_demo();
              });


});
