var ctx = document.getElementById("canvas16");
//console.log(ctx);

var barChartData = {
            labels: ['National Council', 'Council of States', 'Entire Parliament'],
            datasets: [{
                label: 'Random distribution',
                backgroundColor: d3v4.schemeSet3[1],
                data: [
                    {x:1,y:0.0624750},
                    {x:2,y:0.0808920},
                    {x:3,y:0.1433670}

                ]
            }, {
                label: 'Theoretical optimal distribution',
                backgroundColor: d3v4.schemeSet3[2],
                data: [
                  {x:1,y:0.0000275},
                  {x:2,y:0.0004643},
                  {x:3,y:0.0004918},

                ]
            }, {
                label: 'Groundtruth',
                backgroundColor: d3v4.schemeSet3[3],
                data: [
                  {x:1,y:0.0031943},
                  {x:2,y:0.0870080},
                  {x:3,y:0.0902023},


                ]
            },{
                label: 'Optimized distribution (without constraints)',
                backgroundColor: d3v4.schemeSet3[4],
                data: [
                  {x:1,y:0.0000929},
                  {x:2,y:0.0046055},
                  {x:3,y:0.0047047},

                ]
            },{
                label: 'Optimized distribution (with constraints)',
                backgroundColor: d3v4.schemeSet3[5],
                data: [
                  {x:1,y:0.0004078},
                  {x:2,y:0.0061446},
                  {x:3,y:0.0065525},

                ]
            },{
                label: 'Optimized distribution (random initialisation)',
                backgroundColor: d3v4.schemeSet3[6],
                data: [
                  {x:1,y:0.0004460},
                  {x:2,y:0.0084469},
                  {x:3,y:0.0088930},

                ]
            },{
                label: 'Current distribution',
                backgroundColor: d3v4.schemeSet3[7],
                data: [
                  {x:1,y:0.0018402},
                  {x:2,y:0.0214025},
                  {x:3,y:0.0232427},

                ]
            }]
        };

ctx.height = 550;
ctx.height = 400;

var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
      options: {
		  maintainAspectRatio: false,

            title:{
                display:true,
                text:"The deviation in Parliament representativeness"
            },
            scales: {
                xAxes: [{

                }],
                yAxes: [{
                  type: 'logarithmic',
                  ticks: {
                    beginAtZero: true
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Mean square error between proportion of seats and public opinion"
                  }
                }]
            },
            legend:{
              position: 'bottom',
              fontFamily: "'Raleway', sans-serif"
			  //width:400,
			  //height:200,
            }
        }
});
