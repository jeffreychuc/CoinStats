import Chart from 'chart.js';
import { updateMarketData } from './api_util';
import { grabAndDisplayNews } from './news';
import * as d3 from "d3";

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  let graphRef;
  const ctx = document.getElementById("myChart");
  const apiUrl = `https://api.coinmarketcap.com/v1/ticker/?start=1&limit=${document.getElementById("numberOfCoins")}&convert=${document.getElementById("currency")}`;

  const formatData = (apiData, key) =>  {
    let matchedData = apiData.map((coin) => ({[coin.id]: coin[key]}));
    matchedData = matchedData.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
    let coinList = matchedData.map((coin) => Object.keys(coin)[0]);
    let dataSets = {label: key,
                    data: matchedData.map((coin) => Object.values(coin)[0]),
                    backgroundColor: matchedData.map((price) => getRandomColor())
                  };

    return {labels: coinList, datasets: [dataSets]};
  };

  const getRandomColor = () => {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const graphGenerateWrapper = (data, graphType, options) => {
    var myChart = (input) => new Chart(ctx, {
      type: graphType,
      data: input,
      options: options
    });
    graphRef = myChart(data);
  };


  const generateGraph = (data) => {
    if (graphRef) {
      graphRef.destroy();
    }

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
                },
                gridLines: {
                  display:false
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

    let sliceData = document.getElementById('numberOfCoins').value;
    if (isNaN(parseInt(sliceData)))  {
      sliceData = 10;
    }

    let legend = ['price', 'price_btc', '24h_volume_usd', 'market_cap', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d'];
    let key = parseInt(document.getElementById('dataToDisplay').value);
    if (key === 0 || key === 3) {
      key = (legend[key] + '_' + document.getElementById('currency').value).toLowerCase();
    }
    else  {
      key = legend[key].toLowerCase();
    }
    window.CoinStats.key = key;

    let formattedData = formatData(data.slice(0,sliceData), key);
    graphGenerateWrapper(formattedData, graphType, options);

  };

  const simpleSort = (a,b) => {
    if (a > b)  {
      return -1;
    }
    return 1;
  };

  const bubbleChart = (data) =>  {
    const width = 1000;
    const height = 1000;
    d3.select('#bubbles')
    .selectAll("*").remove();
    debugger;
    console.log(simpleSort);
    let svg = d3.select('#bubbles')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', "translate(0,0)");
    let radiusScale = d3.scaleSqrt().domain([-10, 100]).range([1, 10]);
    let simulation = d3.forceSimulation()
    .force('x', d3.forceX(width/2).strength(0.05))
    .force('y', d3.forceY(height/2).strength(0.05))
    .force('collide', d3.forceCollide(100));

    let circles = svg.selectAll(".coins")
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'coin')
    .attr('r', 100)
    .attr('fill', 'lightblue');

    simulation.nodes(data).on('tick', ticked);

    function ticked ()  {
      circles
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
    }
  };



  document.getElementById("buildGraph").addEventListener("click", function(){
    // generateGraph();
    let currencyShort = document.getElementById("currency").value;
    let finishGrabbingMarketData = updateMarketData(currencyShort).done(function (data) {

      generateGraph(data.slice(1));
      bubbleChart(data.slice(1, 1 + parseInt(document.getElementById('numberOfCoins').value)));
      grabAndDisplayNews(data.slice(1,2)[0].name);
    });
  });
});

// https://newsapi.org/v2/top-headlines?q=bitcoin&apiKey=2f6753bb7879458ca5d88e6f783d55e4



