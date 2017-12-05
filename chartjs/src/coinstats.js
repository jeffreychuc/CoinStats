import Chart from 'chart.js';

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  let graphRef;
  const ctx = document.getElementById("myChart");
  const apiUrl = 'https://api.coinmarketcap.com/v1/ticker/?start=1&limit=20&convert=usd';

  const hitApi =() => $.ajax({
    url: apiUrl,
    method: 'GET',
    dataType: "JSON",
  });

  const jsIsDumb = (a,b) => {
    if (a > b)  {
      return -1;
    }
    return 1;
  };

  const formatData = (apiData, key) =>  {
    console.log(apiData);

    let matchedData = apiData.map((coin) => ({[coin.id]: coin[key]}));
    matchedData = matchedData.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
    let coinList = matchedData.map((coin) => Object.keys(coin)[0]);
    debugger;
    let dataSets = {label: key,
                    data: matchedData.map((coin) => Object.values(coin)[0]),
                    backgroundColor: matchedData.map((price) => ('rgba(255, 99, 132, 0.2)'))
                  };

    return {labels: coinList, datasets: [dataSets]};
  };

  const graphGenerateWrapper = (data, graphType, options) => {
    var myChart = (input) => new Chart(ctx, {
      type: graphType,
      data: input,
      options: options
    });
    graphRef = myChart(data);
  };


  var generateGraph = () => {
    let key = document.getElementById('dataToDisplay').value;
    if (graphRef) {
      graphRef.destroy();
    }
    key = 'price_btc';
    hitApi().then((data) => formatData(data, key)).then((data) => {
      let graphType = document.getElementById('chartType').value;
      let options;
      switch(graphType) {
        case 'bar':
          options = {
            responsive: true,
            scales: {
                yAxes: [{
                    // type: 'logarithmic',
                    ticks: {
                        beginAtZero:true,
                    },
                }],
                xAxes: [{
                  ticks: {
                    autoSkip: false
                  }
                }]
            }
          };
        break;
        case 'doughnut':
          options = {
          responsive: true,
          legend: {
              position: 'bottom',
          },
          animation: {
              animateScale: true,
              animateRotate: true
          }};
        break;
      }
      debugger;
      graphGenerateWrapper(data, graphType, options);
    });

  };

  document.getElementById("buildGraph").addEventListener("click", function(){
    generateGraph();
  });

});

// https://newsapi.org/v2/top-headlines?q=bitcoin&apiKey=2f6753bb7879458ca5d88e6f783d55e4

// for use in dropdown?
// [
//   "id",
//   "name",
//   "symbol",
//   "rank",
//   "price_usd",
//   "price_btc",
//   "24h_volume_usd",
//   "market_cap_usd",
//   "available_supply",
//   "total_supply",
//   "max_supply",
//   "percent_change_1h",
//   "percent_change_24h",
//   "percent_change_7d",
//   "last_updated"
// ]

