export const updateMarketData = (currencyShort) => {
  return $.ajax({
    url: "https://api.jsonbin.io/b/5a26362e1b5b61344704325c/latest",
    method: "GET"
  }).then((links) => {
    let currentSeconds = new Date().getTime() / 1000;
    // debugger;
    if (links[currencyShort] !== undefined && links[currencyShort].timestamp !== undefined && ((currentSeconds - links[currencyShort][0].timestamp) < 600)) {
      return $.ajax({
        url: links[currencyShort],
        type: "GET"
      }).then((data) => {
        // debugger;
        return data;
      });
    }
    else  {
      //get new data for new currency
      window.CoinStats = {};
      window.CoinStats.links = links;
      window.CoinStats.currencyShort = currencyShort;
      // debugger;
      return $.ajax({
        url: "https://api.coinmarketcap.com/v1/ticker/?start=1&limit=100&convert="+window.CoinStats.currencyShort,
        method: "GET"
      }).then((updatedData) => {
        // debugger;
        updatedData.unshift({timestamp: new Date().getTime() / 1000});
        // debugger;
        $.ajax({
          url: "https://api.jsonbin.io/b/",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(updatedData)
        }).then(function (newCurrencyCacheUrl) { //store new URL back in original hash and patch
          // debugger; // want to access currencyShort, not in scope?
          window.CoinStats.links[window.CoinStats.currencyShort] = "https://api.jsonbin.io/b/"+newCurrencyCacheUrl.id+"/latest";
          $.ajax({
            url: "https://api.jsonbin.io/b/5a26362e1b5b61344704325c/",
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(window.CoinStats.links)
          });
        });
        return updatedData;
      });
    }
  });
};
