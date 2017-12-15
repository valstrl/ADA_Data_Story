 var width = 938,
    height = 500,
    //m_width = $('#map').width(),
    //kantone, // Alle Kantone der Schweiz
    //bezirke, // Alle Bezirke der Schweiz
    gemeinden, // Alle Gemeinden der Scheiz
    //kanton, // Ausgewählter Kanton
    //bezirk, // Ausgewählter Bezitk
    colorscale,
    map_id,
    m_width ,
    svg,
    g,
    title_text,
    value_text,
    selectValue,
    start,
    dataset;

//highlight when mouseover
var highlight = function() {
    d3.select(this)
    .classed("highlighted", false);
}

//stringyfy
function stringify(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}


//projection
var projection = d3.geo.conicConformal()
    .scale(150)
    .translate([width / 2, height / 1.5]);
//path
var path = d3.geo.path()
    .projection(projection);

//tiles
var tile = d3v4.tile
    .size([width, height]);

//colorscale=d3v4.interpolatePurples;
//set color for value
var get_place_color = function(d, colorscale) {
    //Get data value
    if (d.munip_votes) {
                            var value = d.munip_votes;
                        }
                        else {
                            var value = 0;
                        }
    if (value ) {
            //If value exists…
            if(value == -1){
              return '#B7E1F3';
            }
            else{
            return colorscale(value/100); // color = color scale
          }

    } else {
            //If value is undefined…
            return "#99999F";
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
  d3.selectAll(map_id).select(".title").text(name);
  d3.selectAll(map_id).select(".value").text(value_text + value + "%");

}


function zoom_start(xyz) {
  var transform = d3.project.transform;
  var tiles = tile
      .scale(transform.k)
      .translate([transform.x, transform.y])
      ();

  vector
      .attr("transform", transform)
      .style("stroke-width", 1 / transform.k);

  var image = raster
      .attr("transform", stringify(tiles.scale, tiles.translate))
    .selectAll("image")
    .data(tiles, function(d) { return d; });

  image.exit().remove();

  image.enter().append("image")
      .attr("xlink:href", function(d) { return "http://" + "abc"[d[1] % 3] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("x", function(d) { return d[0] * 256; })
      .attr("y", function(d) { return d[1] * 256; })
      .attr("width", 256)
      .attr("height", 256);


g.selectAll([ ".gemeinden"])
      //.style("stroke-width",(d)=>{return '1';});
      .style("stroke-width", 0.5 / xyz[2] + "px");

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")" + "scale(" + xyz[2] + ")" + "translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll([ ".gemeinden"])
    //.style("stroke-width",(d)=>{return '1';})
    .style("stroke-width", 0.5 / xyz[2] + "px")
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

                    return data.commune == d.properties.GMDNAME;
                });

            if(munip_data[0] != undefined){
              /*console.log("selectValue");
              console.log(selectValue);*/
        		d.munip_votes = munip_data[0][selectValue];
          }
          else{
            d.munip_votes = -1;
          }

        	});

  //set_colordomain(gemeinden);

  var zoom = d3.behavior.zoom()
    //.scale(1)
    //.translate([0,0])
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

function zoomed() {
    /*console.log("hello");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    g.select("gemeinde").style("stroke-width", 1.5 / d3.event.scale + "px");*/
    g.selectAll([ ".gemeinden"])
          //.style("stroke-width",(d)=>{return '1';});
          .style("stroke-width", 0.5 / start[2] + "px");

    var test_x=0.988*start[0];
    test_x=String(test_x);
    var test_y=0.982*start[1];
    test_y=String(test_y);
    g.attr("transform", "translate(" + d3.event.translate  + ")" +  "scale(" + start[2]*d3.event.scale +  ")" +"translate(-" + test_x + ",-" + test_y + ")" )
      .selectAll([ ".gemeinden"])
      .style("stroke-width", 0.5 / start[2] + "px")
      .selectAll(".gemeinde")
      .attr("d", path.pointRadius(20.0 / start[2]));

  }

  m_width = $(map_id).width();
  //SVG for map
  console.log("append svg");
  console.log(map_id);
  svg = d3.selectAll(map_id).select(".map").append("svg")
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", m_width)
      .attr("height", m_width * height / width)
      .attr("id","map")
      .call(zoom);

      svg.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() {
                  d3.selectAll(map_id).select(".title").text(title_text + selectValue);
                  d3.selectAll(map_id).select(".value").text("Mouseover a municipality to see its exact score");
          });



      //SVP group (cantons or municipalities)
      g = svg.append("g")
      .attr("class", "gemeinden")
      .selectAll("path")
      .data(gemeinden)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("class", "gemeinde")
      .attr("d", path)
      .attr("fill", function(d) {return get_place_color(d,colorscale);})
      .style("stroke-width", 0.001 + "px")
      .on("mouseover", update_info)
      .on("mouseout", highlight)


      d3.json("data/topojson/start.json", function(error, json) {
      start = get_xyz((json.features)[0]);
      //zoom_start(start);

    });


  //Append a defs (for definition) element to your SVG
  var defs = d3.selectAll(map_id).select(".legend_svg").append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
    .attr("class", "linear-gradient");

    //Horizontal gradient
  linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

      //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorscale(0)); //light blue

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorscale(1)); //dark blue


    //Draw the rectangle and fill with gradient
    d3.selectAll(map_id).select(".legend_svg").append("rect")
    	.attr("width", "100%")
    	.attr("height", "50%")
      .attr("class", "legend_rect")
      .style("position", "absolute")
      .style("z-index", "10")
    	.style("fill", "url(#linear-gradient)");

    /*d3.select("#legend_svg").append("text")
      .style("position","relative")
    	.attr("class", "legendTitle")
    	.attr("x", "50%")
    	.attr("y", "50%")
    	.style("text-anchor", "middle")
      .style("color", "black")
    	.text("Average Daily Temperature");*/


    //Set scale for x-axis
    var xScale = d3.scale.linear()
    	 .range([0, 300])
    	 .domain([0,100] );

    //Define x-axis
    var xAxis = d3.svg.axis()
    	  .orient("bottom")
    	  .ticks(5)
    	  .tickFormat(function(d) { return d + "%"; })
    	  .scale(xScale);

    //Set up X axis
    d3.selectAll(map_id).select(".legend_svg").append("g")
    	.attr("class", "axis")
    	.attr("transform", "translate(0," + (20) + ")")
      .style("position", "absolute")
      .style("color", "red")
      .style("z-index", "1")
    	.call(xAxis);




};

$(window).resize(function() {
  var w = $(map_id).width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});




function map_score(topojson_path,data_csv_path, colorscale_function, div_id, title_,value_){


  //d3.csv(data_csv_path, function(data) {
    d3.csv(data_csv_path, function(data){
    //selections
      var parties = ["","BDP/PBD","CSP/PCS","CVP/PDC","EVP/PEV","FDP/PLR (PRD)","GLP/PVL","PdA/PST","SP/PS","SVP/UDC","EDU/UDF","GPS/PES","Lega","MCR","SD/DS","Sol.","Ãœbrige/Autres"];

      var select = d3.selectAll(div_id).select('select')
                  .on('change',onchange);

      var options = select
        .selectAll('option')
      	.data(parties).enter()
      	.append('option')
      		.text(function (d) { return d; });

        /*var test={

          "a/a" : 0
        }
        console.log(test);
        var r="a/a";
        console.log(test["a/a"]);*/

      function onchange() {
      	selectValue = d3.select('select').property('value')
        d3.selectAll(div_id).selectAll(".map").select("svg").remove();
        //g.selectAll( "#gemeinden").remove();
        start_demo();
      };
  //})

        dataset = data;
              d3.selectAll(div_id).select(".value").text("Load municipalities");

              // Lade Gemeinden
              d3.json(topojson_path, function(error, json) {
                    gemeinden = topojson.feature(json, json.objects.gemeinden).features;
                    title_text=title_;
                    value_text=value_;
                    d3.selectAll(div_id).select(".title").text(title_text + selectValue);
                    d3.selectAll(div_id).select(".value").text("Mouseover a municipality to see its exact score");
                    //Starte die Demonstration
                    colorscale=colorscale_function;
                    map_id=div_id;
                    //start_demo();
                });

})
}



map_score("data/topojson/gemeinden.topo.json","data/votes/results_2015.csv", d3v4.interpolatePurples, "#map_score","Results of National Council for ","Score: ");
