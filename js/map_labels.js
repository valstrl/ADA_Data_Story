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
   selectValue,
   start,
   dataset;



//stringyfy
function stringify(scale, translate) {
 var k = scale / 256, r = scale % 1 ? Number : Math.round;
 return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}

//highlight when mouseover
var highlight = function() {
   d3.select(this)
   .classed("highlighted", false);
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
           return colorscale[value]; // color = color scale
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
  console.log("from map label");
  console.log(map_id);

 gemeinden.forEach(function(d) {
               var munip_data = dataset.filter( function(data) {

                   return data.Name == d.properties.GMDNAME;
               });

           if(munip_data[0] != undefined){
             /*console.log("selectValue");
             console.log(selectValue);*/
           d.munip_votes = munip_data[0].Label;
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
  console.log("hello from zoomed");

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
 svg = d3.selectAll(map_id).select(".map").append("svg")
     .attr("preserveAspectRatio", "xMidYMid")
     .attr("viewBox", "0 0 " + width + " " + height)
     .attr("width", m_width)
     .attr("height", m_width * height / width)
     .attr("class","map_svg")
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
     zoom_start(start);

   });


};

$(window).resize(function() {
 var w = $(map_id).width();
 svg.attr("width", w);
 svg.attr("height", w * height / width);
});



function map_labels(topojson_path,data_csv_path, colorscale_array, div_id, title_){


 //d3.csv(data_csv_path, function(data) {
   d3.csv(data_csv_path, function(data){

       dataset = data;
             d3.selectAll(div_id).select(".value").text("Load municipalities");

             // Lade Gemeinden
             d3.json(topojson_path, function(error, json) {
                   gemeinden = topojson.feature(json, json.objects.gemeinden).features;
                   title_text=title_;
                   d3.selectAll(div_id).select(".title").text(title_text);
                   //Starte die Demonstration
                   colorscale=colorscale_array;
                   map_id=div_id;
                   start_demo();
               });

})
}


map_labels("data/topojson/gemeinden.topo.json","data/votes/spectral_labels.csv", d3v4.schemeSet3, "#map_spectral","Spectral Clustering ");
