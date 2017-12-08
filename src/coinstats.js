import Chart from 'chart.js';
import { updateMarketData } from './api_util';
import { grabAndDisplayNews } from './news';
import * as d3 from "d3";


document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  window.CoinStats = {};
  let graphRef;
  const ctx = document.getElementById("myChart").getContext('2d');
  // debugger;
  let gradient = ctx.createLinearGradient(0, 0, 0, 1000);
  gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');
  gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

  let hoverGradient = ctx.createLinearGradient(0, 0, 0, 200);
  hoverGradient.addColorStop(0, 'rgba(200, 0,0, 0.3)');

  const formatData = (apiData, key) =>  {
    let matchedData = apiData.map((coin) => ({[coin.id]: coin[key]}));
    matchedData = matchedData.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
    let coinList = matchedData.map((coin) => Object.keys(coin)[0]);
    let dataSets = {label: key,
                    data: matchedData.map((coin) => Object.values(coin)[0]),
                    backgroundColor: gradient,
                    borderColor: Chart.helpers.color('#65f442'),
                    borderWidth: 1,
                    // hoverBackgroundColor: hoverGradient
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
                  type: 'logarithmic',
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
      case 'line':
        options = {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            easing: 'easeInOutQuad',
            duration: 520
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'rgba(200, 200, 200, 0.05)',
                lineWidth: 1
              }
            }],
            yAxes: [{
              gridLines: {
                color: 'rgba(200, 200, 200, 0.08)',
                lineWidth: 1
              }
            }]
          },
          elements: {
            line: {
              tension: 0.4
            }
          },
          legend: {
            display: false
          },
          point: {
            backgroundColor: 'white'
          },
          tooltips: {
            backgroundColor: 'rgba(0,0,0,0.3)',
            titleFontColor: 'red',
            caretSize: 5,
            cornerRadius: 2,
            xPadding: 10,
            yPadding: 10
          }
        };
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
    const width = 500;
    const height = 500;
    d3.select('#bubbles')
    .selectAll("*").remove();
    console.log(simpleSort);
    let svg = d3.select('#bubbles')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', "translate(0,0)");
    let dataSorted = data.map((a) => parseFloat(a[window.CoinStats.key]));
    dataSorted = dataSorted.sort((a,b) => simpleSort(b,a));
    let radiusScale = d3.scaleSqrt().domain([dataSorted[0], dataSorted.slice(-1)[0]]).range([5, 100]);
    let simulation = d3.forceSimulation()
    .force('x', d3.forceX(width/2).strength(0.05))
    .force('y', d3.forceY(height/2).strength(0.05))
    .force('collide', d3.forceCollide(d => radiusScale(parseFloat(d[window.CoinStats.key]))));

    let circles = svg.selectAll(".coins")
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'coin')
    .attr('r', d => radiusScale(parseFloat(d[window.CoinStats.key])))
    .attr('fill', 'rgba(0, 255, 21,0.8)')
    .attr('opacity', 0.8)
    .append('text')
    .attr('text', 'lol');

    simulation.nodes(data).on('tick', ticked);

    function ticked ()  {
      circles
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
    }
  };





  document.getElementById("buildGraph").addEventListener("click", function(){
    let currencyShort = document.getElementById("currency").value;
    // let BTCPriceIntervalID = setInterval( () => {
    //   $.ajax({
    //     url: `https://api.coindesk.com/v1/bpi/currentprice/${currencyShort}`
    //   }).then((response) => {
    //     debugger;
    //     document.getElementById('odometer').innerHTML = JSON.parse(response).bpi[currencyShort].rate_float;
    // });
    // },1000);
    let userIn = document.getElementsByClassName('userInputs')[0].classList.add('hidden');
    let buildGraphButton = document.getElementById('buildGraph').classList.add('hidden');
    let aligner = document.getElementsByClassName('aligner')[0].classList.add('hidden');
    // let counter = document.getElementById('odometer').classList.remove('hidden');
    let finishGrabbingMarketData = updateMarketData(currencyShort).done(function (data) {
      let headerClass = document.getElementsByClassName('headerLogo')[0].classList.add('headerDataPresent');
      document.getElementById('graphicsArea').classList.remove('hidden');
      grabAndDisplayNews(data.slice(2,3)[0].name);
      generateGraph(data.slice(1));
      bubbleChart(data.slice(1, 1 + parseInt(document.getElementById('numberOfCoins').value)));
    });
  });


  //auto align select dropdown
  (function($, window){
    var arrowWidth = 30;

    $.fn.resizeselect = function(settings) {
      return this.each(function() {

        $(this).change(function(){
          var $this = $(this);

          // create test element
          var text = $this.find("option:selected").text();
          var $test = $("<span>").html(text);

          // add to body, get width, and get out
          $test.appendTo('body');
          var width = $test.width();
          $test.remove();

          // set select width
          $this.width(width + arrowWidth + 30 );

          // run on start
        }).change();

      });
    };

    // run by default
    $("select.resizeselect").resizeselect();

  })(jQuery, window);

});

// https://newsapi.org/v2/top-headlines?q=bitcoin&apiKey=2f6753bb7879458ca5d88e6f783d55e4
