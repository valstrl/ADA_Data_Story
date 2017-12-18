


class Map2 {
    constructor() {
       this.width = 938,
       this.height = 500,
       this.gemeinden,
       this.colorscale,
       this.map_id,
       this.m_width ,
       this.svg,
       this.g,
       this.title_text,
       this.value_text,
       this.selectValue,
       this.color_bins,
       this.bins
       this.start,
       this.projection,
       this.dataset;

       //projection
      this.projection = d3.geo.conicConformal()
        .scale(150)
        .translate([this.width / 2, this.height / 1.5]);
      //path
      this.path= d3.geo.path()
         .projection(this.projection);

      this.jenks9 = {};

     /*this.scales.quantize = d3.scale.quantize()
         .domain([0, .15])
         .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));*/

    }

    //highlight when mouseover
    highlight() {
       d3.select(this)
       .classed("highlighted", false);
    }

    //set color for value
    get_place_color(d, colorscale) {
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


               //return colorscale(value/100); // color = color scale

               return this.jenks9(value/100);
             }

       } else {
               //If value is undefined…
               return "#99999F";
       }
    };

   //write the value for cantons (when clicked or mouseover) and municipalities (mouseover)
  update_info(d,context) {
       if (d.munip_votes) {
           var value = d.munip_votes;
       }
       else {
           var value = 0;
       }


       d3.select(context).classed("highlighted", true);

       var name;
       if(d.properties.KTNAME) {
         name = d.properties.KTNAME;
       }
       else if(d.properties.GMDNAME) {
         name = d.properties.GMDNAME;
       }


        //d3.selectAll(this.map_id).select(".title_map").text(name);
        if(value != -1){
          d3.selectAll(this.map_id).select(".value_map").text( name + ": ");
          d3.selectAll(this.map_id).select(".value2_map").text(this.selectValue + " score = " + value + "%");
      }else{
        d3.selectAll(this.map_id).select(".value_map").text( name );
        d3.selectAll(this.map_id).select(".value2_map").text("");
      }

   }


   zoom_start(xyz) {

       this.g.selectAll([ ".gemeinden"])
            //.style("stroke-width",(d)=>{return '1';});
            .style("stroke-width", 0.5 / xyz[2] + "px");

        this.g.transition()
          .duration(750)
          .attr("transform", "translate(" + this.projection.translate() + ")" + "scale(" + xyz[2] + ")" + "translate(-" + xyz[0] + ",-" + xyz[1] + ")")
          .selectAll([ ".gemeinden"])
          //.style("stroke-width",(d)=>{return '1';})
          .style("stroke-width", 0.5 / xyz[2] + "px")
          .selectAll(".gemeinde")
          .attr("d", this.path.pointRadius(20.0 / xyz[2]));
   }

   get_xyz(d) {
        var bounds = this.path.bounds(d);
        var w_scale = (bounds[1][0] - bounds[0][0]) / this.width;
        var h_scale = (bounds[1][1] - bounds[0][1]) / this.height;
        var z = .96 / Math.max(w_scale, h_scale);
        var x = (bounds[1][0] + bounds[0][0]) / 2;
        var y = (bounds[1][1] + bounds[0][1]) / 2 + (this.height / z / 6);
        return [x, y, z];
   }

   start_demo() {
    this.gemeinden.forEach(function(d) {
                  var munip_data = this.dataset.filter( function(data) {

                      return data.commune == d.properties.GMDNAME;
                  });

              if(munip_data[0] != undefined){
              d.munip_votes =  munip_data[0][this.selectValue];
            }
            else{
              d.munip_votes = -1;
            }

          }.bind(this));

    this.m_width = $(this.map_id).width();

    //SVG for map
    this.svg = d3.selectAll(this.map_id).select(".map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + this.width + " " + this.height)
        .attr("width", this.m_width)
        .attr("height", this.m_width * this.height / this.width)
        .attr("class","map_svg");

    this.svg.append("rect")
        .attr("class", "background")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("mouseover", function() {
                d3.selectAll(this.map_id).select(".title_map").text(this.title_text );
                d3.selectAll(this.map_id).select(".value_map").text("Mouseover a municipality to see its exact score");
                d3.selectAll(this.map_id).select(".value2_map").text("");

        }.bind(this));

    //SVP group (cantons or municipalities)
     var id=this.map_id;
     var here=this;
    this.g = this.svg.append("g")
    .attr("class", "gemeinden")
    .selectAll("path")
    .data(this.gemeinden)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("class", "gemeinde")
    .attr("d", this.path)
    .attr("fill", function(d) {return this.get_place_color(d,this.colorscale);}.bind(this))
    .style("stroke-width", 0.001 + "px")
    .on("mouseover",function(d) { here.update_info(d,this)})
    .on("mouseout",  here.highlight)

    this.addLegend();

   d3.json("data/topojson/start.json", function(error, json) {
     this.start = this.get_xyz((json.features)[0]);
     this.zoom_start(this.start);
    }.bind(this));

};

map_resize(){
  $(window).resize(function() {
   var w = d3.selectAll(this.map_id).select(".map").style("width");
   d3.selectAll(this.map_id).select(".map").select("svg").attr("width", w);
   d3.selectAll(this.map_id).select(".map").select("svg").attr("height", w * this.height / this.width);
   d3.selectAll(this.map_id).select(".legend").select("svg").attr("width", w);
   d3.selectAll(this.map_id).select(".legend").select("svg").attr("height", w * this.height / this.width);

  }.bind(this))
}

addLegend(){

  //Draw the rectangle and fill with gradient
  d3.selectAll(this.map_id).select(".legend_svg").append("g")
    .attr("class", "legend_rect")
    //.style("position", "relative")
    .style("z-index", "10")
    .selectAll("rect")
    .data(this.bins)
    .enter()
    .append("rect")
    .attr("class", "bins")
    .attr("x",function(d){return d*900 + "px";})
    .style("height", "50%")
    .style("width", function(d,i){
      var w = this.bins[i + 1]-this.bins[i];
      return w*900 + "px";}.bind(this))
    .style("fill",function(d,i) {
      return this.color_bins[i];}.bind(this))

  d3.selectAll(this.map_id).select(".legend_svg").select("g")
    .append("rect")
    .attr("class", "bins")
    .attr("x", this.bins[this.bins.length-1]*900 + "px")
    .style("height", "50%")
    .style("width", function(d){
      var w = 1-this.bins[this.bins.length-1];
      return w*900 + "px";}.bind(this))
    .style("fill",function(d) {
      return this.color_bins[this.bins.length-1];}.bind(this))

    //Set scale for x-axis
    var xScale = d3.scale.linear()
    	 .range([0, 900])
    	 .domain([0,100] );

    //Define x-axis
    var xAxis = d3.svg.axis()
    	  .orient("bottom")
    	  .ticks(10)
    	  .tickFormat(function(d) { return d + "%"; })
    	  .scale(xScale);

    //Set up X axis
    d3.selectAll(this.map_id).select(".legend_svg").append("g")
    	.attr("class", "axis")
    	.attr("transform", "translate(0," + (20) + ")")
    	.call(xAxis);

    d3.selectAll(this.map_id).select(".legend_svg").select(".axis").select("path").remove();

    d3.selectAll(this.map_id).select(".legend_svg").select(".axis").selectAll("text")
    .style("fill","#373737")
    .style("text-anchor","start");

    d3.selectAll(this.map_id).select(".legend_svg").select(".axis").selectAll(".tick").select("line")
    .attr("stroke-width", "1px")
    .attr("stroke","#373737");


  }

  JenksBins(data){

    var jenks_range=[...Array(10).keys()];
    this.color_bins=jenks_range.map(function(d){ return this.colorscale(d/10);}.bind(this));
    this.bins=ss.jenks(data.map(function(d) { return +d[this.selectValue]/100; }.bind(this)), 9);
    this.bins[this.bins.length-1]=this.bins[this.bins.length-1] + 0.0001;

    this.jenks9 = d3.scale.threshold()
     .domain(this.bins)
     .range(this.color_bins);
  }


  map_scores(topojson_path,data_csv_path, colorscale, div_id, title_, value_){

    this.colorscale=colorscale;
    this.map_id=div_id;
   //d3.csv(data_csv_path, function(data) {
     d3.csv(data_csv_path, function(data){

       var parties = ["BDP/PBD","CSP/PCS","CVP/PDC","EVP/PEV","FDP/PLR (PRD)","GLP/PVL","PdA/PST","SP/PS","SVP/UDC","EDU/UDF","GPS/PES","Lega","MCR","SD/DS","Sol.","Ãœbrige/Autres"];

       var select = d3.selectAll(div_id).select('select')
                   .on('change',onchange.bind(this));

       var options = select
         .selectAll('option')
         .data(parties).enter()
         .append('option')
           .text(function (d) { return d; });

      this.selectValue=parties[0];
      this.JenksBins(data);

       function onchange() {
        this.selectValue = d3.selectAll(div_id).select('select').property('value');;
        this.JenksBins(data);

        d3.selectAll(div_id).selectAll(".map").select("svg").remove();
        d3.selectAll(div_id).selectAll(".legend").selectAll("g").remove();

        this.start_demo();

       };

         this.dataset = data;
               d3.selectAll(div_id).select(".value_map").text("Load municipalities");

               // Lade Gemeinden
               d3.json(topojson_path, function(error, json) {
                     this.gemeinden = topojson.feature(json, json.objects.gemeinden).features;
                     this.title_text=title_;
                     this.value_text=value_;
                     d3.select(div_id).select(".title_map").text(this.title_text);
                     d3.select(div_id).select(".value_map").text(this.value_text);
                     d3.select(div_id).select(".value2_map").text("");
                     //Starte die Demonstration
                     //this.colorscale=colorscale;
                     //this.map_id=div_id;
                     this.start_demo();
                 }.bind(this))


      }.bind(this))
 }

}

var mapScore= new Map2();
mapScore.map_scores("data/topojson/gemeinden_2015.topo.json","data/votes/results_2015.csv", d3v4.interpolateGnBu, "#map_score","2015 Federal Election", "Mouseover a municipality to see its exact score");
mapScore.map_resize();
