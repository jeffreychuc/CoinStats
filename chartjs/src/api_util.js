export const updateMarketData = (currencyShort) => {
  let savedMarketData = $.ajax({
    url: "https://api.jsonbin.io/b/5a26362e1b5b61344704325c/latest",
    method: "GET"
  }).then((links) => {
    let currentSeconds = new Date().getTime() / 1000;
    debugger;
    if (links[currencyShort] !== undefined && currentSeconds - links[currencyShort][0].timestamp < 600) {
      return $.ajax({
        url: links[currencyShort],
        type: "GET"
      });
    }
    else  {
      //get new data for new currency
      window.CoinStats = {};
      window.CoinStats.links = links;
      window.CoinStats.currencyShort = currencyShort;
      debugger;
      $.ajax({
        url: "https://api.coinmarketcap.com/v1/ticker/?start=1&limit=20&convert="+window.CoinStats.currencyShort,
        method: "GET"
      }).then(function (updatedData) { //post updated data to jsonbin
        debugger;
        updatedData.unshift({timestamp: new Date().getTime() / 1000});
        window.CoinStats.updatedData = updatedData;
        $.ajax({
          url: "https://api.jsonbin.io/b/",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(updatedData)
        }).then(function (newCurrencyCacheUrl) { //store new URL back in original hash and patch
          debugger; // want to access currencyShort, not in scope?
          window.CoinStats.links[window.CoinStats.currencyShort] = "https://api.jsonbin.io/b/"+newCurrencyCacheUrl.id+"/latest";
          $.ajax({
            url: "https://api.jsonbin.io/b/5a26362e1b5b61344704325c/",
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(window.CoinStats.links)
          }).then((response) => {
            debugger;
            return window.CoinStats.updatedData;
          });
        });
      });
    }
  });
};
