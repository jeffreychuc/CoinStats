## CoinStats

### Background and Overview

CoinStats is a data visulization tool that allows a user to quickly scope out the current crypto currecy market climate.  The cryptocurrency market is a rapidly growing and thriving marketplace that requires persistant monitoring.



### Functionality & MVP

With CoinStats, users will be able to:

- [X] Sort charts based on
* Price in their desired currency
* Market Volume
* % Change in value over a specified time period
- [X] Determine how many coins will be displayed on the graph.
* Allow the user to compare specific coins against each other
- [X] Pull current data from an external API
* CoinMarketCap API

### Wireframes

This app will consist of a single screen with a bar graph with each currency on the X-Axis and the desired stat to view on the Y-Axis.  Selectors in the form of dropdowns for the specific currency and

![wireframes](wireframe.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript for overall structure and data filtering,
- `JQuery` for managing fetching of market data from an external API.
- `ChartJS` for graph rendering.

### Implementation Timeline

**Over the weekend**:
- [x] Research and select an appropriate API for data.
*   Note: was going to use CoinBin but was unavailable at the time of research.  Determined that Coinmarketcap's api was a sutiable replacment.
- [x] Determine the appropriate Graphing library for displaying data
* Looked into both D3 and Chart.js, determined Chart to be the most sutiable library.

**Day 1**: Setup all necessary Node modules, including getting webpack up and running.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and ensure that everything is running properly.

- [X] Get `webpack` up and running.  Complete skeleton of index.html.
- [X] Get a basic chart up and running with chartjs.

**Day 2**: Ensure that graphing is working without selectors, style the graphs and determine the final overall look of the project.

- [X] Determine the best way to handle data, is it possible to have live updating data?
- [X] Style the graphs and make everything reactive.
- [X] Implemented jsonbin caching of data as not to get rate limited from coinmarketcap api
    * App currently `GET`s from a jsonbin that contains keys for currencies that have already been pulled.  If a currency has not been previously requested, the app will pull new data from coinmarketcap and `POST` to jsonbin and then `PUT` the original link table with the new jsonbin link.  If the currency has been previously requested, the app will check to ensure that the data is not stale (> 6 minutes).  If the data is determined to be stale, new data will be requested from coinmarketcap and then be `PUT` back to jsonbin.

**Day 3**: Expand the capabilities of the graphs, implement user selection and filtering.

- [X] Determine and implement the most optimal amount of data to show on screen.
- [X] Implement user selection of data
- [X] Implemented pulling of relevant news articles from newsapi.org.
      * Pulls relevant articles based on top cryptocurrency from selected category.


**Day 4**: Polish up UI and UX and finish README and clean up code.

- [X] Ensure that all code is functioning and ready for production
- [X] Ensure that code is behaving on an externally hosted env.


