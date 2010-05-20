SG = (function() {
  return {
// ==============================================================================
    search: {
// ------------------------------------------------------------------------------
      yahoo: function(query) {
        $.ajax({
          url: "http://boss.yahooapis.com/ysearch/web/v1/" + query,
          data: {
            appid: "NZ2Pq3zV34EpOGvAw.qv01EVf1Z.eZVClPJuqEpl1qU0L4lWArruHslZ2rBS3l4PrN0-",
          },
          dataType: 'jsonp',
          success: function(data) {
            alert("Yahoo: " + data.ysearchresponse.totalhits);
          }
        });
      }, 
// ------------------------------------------------------------------------------
      google: function(query) {
        $.ajax({
          url: "http://ajax.googleapis.com/ajax/services/search/web",
          data: {
            v: '1.0',
            safe: 'off',
            filter: 1,
            q: query
          },
          dataType: 'jsonp',
          success: function(data) {
            alert("Google: " + data.responseData.cursor.estimatedResultCount);
          }
        });
      },
// ------------------------------------------------------------------------------
      bing: function(query) {
        $.ajax({
          url: "http://api.search.live.net/json.aspx",
          data: {
            Appid: "8E084F32A9461A1EC4DD409C436B741F1D6E3AA6",
            query: query,
            sources: "web",
            'Web.Count': 1,
            adult: "off",
            JsonType: 'callback'
          },
          dataType: 'jsonp',
          jsonp: "JSONCallback",
          success: function(data) {
            alert("Bing: " + data.SearchResponse.Web.Total);
          }
        });
      }
    }
// ==============================================================================
  }
})();
