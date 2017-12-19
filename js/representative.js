var ctx = document.getElementById("canvas16");
console.log(ctx);

var barChartData = {
            labels: ['National Loss', 'States Loss', 'National + States Loss'],
            datasets: [{
                label: 'Random distribution',
                backgroundColor: d3v4.schemeSet3[1],
                data: [
                    {x:1,y:2},
                    {x:2,y:5},
                    {x:3,y:3},

                ]
            }, {
                label: 'Theorical optimum',
                backgroundColor: d3v4.schemeSet3[2],
                data: [
                  {x:1,y:2},
                  {x:2,y:5},
                  {x:3,y:3},

                ]
            }, {
                label: 'Real distribution',
                backgroundColor: d3v4.schemeSet3[3],
                data: [
                  {x:1,y:2},
                  {x:2,y:5},
                  {x:3,y:3},

                ]
            },{
                label: 'Optimized distribution (without constrain)',
                backgroundColor: d3v4.schemeSet3[4],
                data: [
                  {x:1,y:2},
                  {x:2,y:5},
                  {x:3,y:3},

                ]
            },{
                label: 'Optimized distribution',
                backgroundColor: d3v4.schemeSet3[5],
                data: [
                  {x:1,y:2},
                  {x:2,y:5},
                  {x:3,y:3},

                ]
            },{
                label: 'Optimized distribution (random initialisation)',
                backgroundColor: d3v4.schemeSet3[6],
                data: [
                  {x:1,y:2},
                  {x:2,y:5},
                  {x:3,y:3},

                ]
            }]
        };

var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
      options: {
            title:{
                display:true,
                text:"Title"
            },
            scales: {
                xAxes: [{

                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
            }
        }
});
