var ctx = document.getElementById("canvas16");

data: [{
        x: 10,
        y: 20
    }, {
        x: 15,
        y: 10
    }]

var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
});