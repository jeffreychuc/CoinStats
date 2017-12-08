export const grabAndDisplayNews = (coin) => {
  debugger;
  let newsApi = `https://newsapi.org/v2/everything?q=${coin}&sortBy=publishedAt&language=en&apiKey=009ec95ece354516a4e85c09a77cbcf7`;
  $.ajax({
    url: newsApi,
    method: 'GET'
  }).then((news) => {

    let newsAnchorPoint = document.getElementById('newsList');

    let newsSelection = news.articles.slice(0,3);

    while (newsAnchorPoint.firstChild) {
      newsAnchorPoint.removeChild(newsAnchorPoint.firstChild);
    }

    newsSelection.forEach((article) => {
      let child = document.createElement('div');
      child.classList.add('article');
      let title = document.createElement('a');
      title.setAttribute('href',article.url);
      title.innerHTML = article.title;
      let descriptionDiv = document.createElement('p');
      descriptionDiv.innerHTML += article.description;
      child.append(title);
      child.append(descriptionDiv);
      child.append(document.createElement('br'));
      newsAnchorPoint.appendChild(child);
    });
  });
};
