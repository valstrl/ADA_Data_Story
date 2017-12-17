class Parliament{

  constructor(parliament_json_path,div_id,title){
    this.id=div_id;
    this.json_path=parliament_json_path;
    this.title_parliament=title;

    this.parliament = d3.parliament().width(800).height(550).innerRadiusCoef(0.4);
    this.parliament.enter.fromCenter(true).smallToBig(true);
    this.parliament.exit.toCenter(true).bigToSmall(true);

  }

  parliamentSchema(){
  d3.json(this.json_path, this.setData.bind(this));
};

  setData(d) {
      console.log("setData");
      d3.selectAll(this.id).append("div")
      .text(this.title_parliament)
      .attr("class","title_map")
      .style("position","relative")
      .style("left","40%")
      //.style("margin_right","-50%")
      //.style("transform","translate(-50%, 0)");

      d3.selectAll(this.id).append("svg")
      .datum(d).call(this.parliament)
      .style("position","relative")
      .style("left","50%")
      .style("margin_right","-50%")
      .style("transform","translate(-50%, 5%)");

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
        .attr("fill", "#F4F4F4")
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
        })

        .text(function (o, i) {
            var nn = o.seats;
            return o.id + " (" + nn + ")";
        })
}


}

var parliament1= new Parliament("data/votes/parliament_2015.json","#parliament1", "2015 National Council Composition");
parliament1.parliamentSchema();
