import Chart from 'chart.js';
import autoComplete from './auto-complete-min';

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  let graphRef;
  const ctx = document.getElementById("myChart");
  const apiUrl = 'https://api.coinmarketcap.com/v1/ticker/?start=1&limit=100';

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
    debugger;
    let coinList = matchedData.map((coin) => Object.keys(coin)[0]);
    let dataSets = {label: key,
                    data: matchedData.map((coin) => Object.values(coin)[0]),
                    backgroundColor: matchedData.map((price) => ('rgba(255, 99, 132, 0.2)'))
                  };

    return {labels: coinList, datasets: [dataSets]};
  };

  const graphGenerateWrapper = (data) => {
    var myChart = (input) => new Chart(ctx, {
      type: 'bar',
      data: input,
      options: {
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
      }
    });
    graphRef = myChart(data);
  };


  var generateGraph = () => {
    let key = document.getElementById('dataToDisplay').value;
    if (graphRef) {
      graphRef.destroy();
    }
    hitApi().then((data) => formatData(data, key)).then((data) => graphGenerateWrapper(data));

  };

  document.getElementById("buildGraph").addEventListener("click", function(){
    generateGraph();
  });

});



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
