class Parliament{

  constructor(parliament_json_path,div_id){
    this.id=div_id;
    this.json_path=parliament_json_path;


    this.parliament = d3.parliament().width(600).height(450).innerRadiusCoef(0.4);
    this.parliament.enter.fromCenter(true).smallToBig(true);
    this.parliament.exit.toCenter(true).bigToSmall(true);

  }

  parliamentSchema(){
  d3.json(this.json_path, this.setData.bind(this));
};

  setData(d) {
      console.log("setData");
      d3.selectAll(this.id).append("svg")
      .datum(d).call(this.parliament)
      .style("position","relative")
      .style("left","50%")
      .style("margin_right","-50%")
      .style("transform","translate(-50%, 10%)");

      this.draw_legend(d);

  };

 draw_legend(data) {

    console.log("draw_legend");

    var start = 20;
    var radius =10;
    var dx_text = 2*radius;
    var width=d3.selectAll(this.id).select(".d3-parliament").style("width");
    width=width.replace("px","");
    var height_legend = d3.selectAll(this.id).select(".d3-parliament").style("height");
    height_legend=height_legend.replace("px","");

    d3.selectAll(this.id).selectAll(".d3-parliament").append("g")
      .attr("class", "parliament_legend")

    d3.selectAll(this.id).selectAll(".parliament_legend").selectAll(".circleLegend").remove();
    d3.selectAll(this.id).selectAll(".parliament_legend").selectAll(".textLegend").remove();


    d3.selectAll(this.id).selectAll(".parliament_legend").selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circleLegend")
        .attr("class",function(d) { return " seat "+d.id;})

        .attr("cx", function (o, i) {

              var j;
                if(i==4 || i==8 || i==12){
                  j=0
                }else if(i==5 || i==9 || i==13){
                  j=1;
                }else if(i==6 || i==10 || i==14){
                  j=2;
                } else if(i==7 || i==11 || i==15){
                  j=3;
              }
              else{
                  j=i;
              }
                var incr = (width-start)/(4);
                return incr * (j) + start;



        })
        .attr("cy", function(o,i) {

                if(i <= 3){
                return height_legend-3*radius ;
              }else if (i > 3 && i <= 7) {
                return height_legend-2*3*radius ;
              }else if (i > 7 && i <= 11){
                return height_legend-3*3*radius ;
              }else{
                return height_legend-4*3*radius ;
              }
        })
        .attr("r", radius);

    var width_parliament =d3.selectAll(this.id).selectAll(".parliament").style("width");


    d3.selectAll(this.id).selectAll(".parliament_legend").selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("class", "textLegend")
        .text(function (o, i) {
            var nn = o.seats;
            return o.id + " (" + nn + ")";
        })
        .attr("fill", "#373737")
        .attr("x", function(o,i) {
                var j;
                  if(i==4 || i==8 || i==12){
                    j=0
                  }else if(i==5 || i==9 || i==13){
                    j=1;
                  }else if(i==6 || i==10 || i==14){
                    j=2;
                  } else if(i==7 || i==11 || i==15){
                    j=3;
                }
                else{
                    j=i;
                }
                  var incr = (width-start)/(4);
                  return incr * (j) + start + dx_text;
        })
        .attr("y", function(o,i) {

          if(i <= 3){
          return height_legend-3*radius ;
        }else if (i > 3 && i <= 7) {
          return height_legend-2*3*radius ;
        }else if (i > 7 && i <= 11){
          return height_legend-3*3*radius ;
        }else{
          return height_legend-4*3*radius ;
        }
      });

}


}

var parliament_national= new Parliament("data/votes/parliament_2015_national.json","#parliament_national", "2015 National Council Composition");
parliament_national.parliamentSchema();
var parliament_states= new Parliament("data/votes/parliament_2015_states.json","#parliament_states", "2015 Council of States Composition");
parliament_states.parliamentSchema();
