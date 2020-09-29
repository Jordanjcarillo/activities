// working api-key, or put your own in here
var apiKey = "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M"


function buildQueryURL() {
  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?"

  // build an array of query parameters, then we will join them together with '&'
  var queryParams = [
    `api-key=${apiKey}`,
    `q=${$("#search-term").val().trim()}` ]

  var startYear = $("#start-year").val().trim()
  if( startYear )
    queryParams.push( `begin_date=${startYear}0101` ) // add month 01, day 01 onto year

  var endYear = $("#end-year").val().trim()
  if( endYear )
    queryParams.push( `end_date=${endYear}0101` ) // add month 01, day 01 onto year
  
  console.log( `QUERY: `+ queryURL+queryParams.join('&'))
  return queryURL+queryParams.join('&')
}

function updateArticleList( data ) {
  var articles = data.response.docs
  // check how many articles user wants to display and cut off at that limit
  // or if less articles available, that becomes the limit
  var numArticles = Math.min( articles.length, $("#article-count").val() )

  // Loop through and build elements for the defined number of articles
  for (var i = 0; i < numArticles; i++) {
    // Get specific article info for current index
    var article = articles[i]

    // now build the HTML to display
    var html = `<li class='list-group-item articleHeadline'>`

    // if a headline, add this to the html
    if (article.headline && article.headline.main) {
      html += `<span class='label label-primary'>${i+1}</span>
        <strong>${article.headline.main}</strong>`
    }

    if (article.byline && article.byline.original) {
      html += `<h5>${article.byline.original}</h5>`
    }

    if (article.section_name) {
      html += `<h5>Section: ${article.section_name}</h5>`
    }

    if (article.pub_date) {
      html += `<h5>${article.pub_date}</h5>`
    }

    html += `<a href='${article.web_url}'>${article.web_url}</a>`

    // Append the article
    $('#article-section').append(html)
  }
}

// Function to empty out the articles
function clearArticleList() {
  $("#article-section").empty()
}

function getArticleList() {
  $.ajax({
    url: buildQueryURL()
  }).then( updateArticleList );
}

// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
  event.preventDefault()

  // Empty the region associated with the articles
  clearArticleList()

  getArticleList()
});

$("#clear-all").on("click", clearArticleList );
