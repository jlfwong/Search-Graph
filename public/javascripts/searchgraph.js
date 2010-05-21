SG = (function() {
  return {
// ==============================================================================
    search: {
// ------------------------------------------------------------------------------
      yahoo: function(query, callback) {
        // data.ysearchresponse.totalhits
        $.ajax({
          url: "http://boss.yahooapis.com/ysearch/web/v1/" + query,
          data: {
            appid: "NZ2Pq3zV34EpOGvAw.qv01EVf1Z.eZVClPJuqEpl1qU0L4lWArruHslZ2rBS3l4PrN0-",
          },
          dataType: 'jsonp',
          success: callback
        });
      }, 
// ------------------------------------------------------------------------------
      google: function(query, callback) {
        // data.responseData.cursor.estimatedResultCount
        $.ajax({
          url: "http://ajax.googleapis.com/ajax/services/search/web",
          data: {
            v: '1.0',
            safe: 'off',
            filter: 1,
            q: query
          },
          dataType: 'jsonp',
          success: callback
        });
      },
// ------------------------------------------------------------------------------
      bing: function(query, callback) {
        // data.SearchResponse.Web.Total
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
          success: callback
        });
      }
    },
// ==============================================================================
    numResultsFrom: {
// ------------------------------------------------------------------------------
      yahoo: function(query, callback) {
        SG.search.yahoo(query, function(data) {
          callback(parseInt(data.ysearchresponse.totalhits), data);
        });
      },
// ------------------------------------------------------------------------------
      google: function(query, callback) {
        SG.search.google(query, function(data) {
          callback(parseInt(data.responseData.cursor.estimatedResultCount), data);
        });
      },
// ------------------------------------------------------------------------------
      bing: function(query, callback) {
        SG.search.bing(query, function(data) {
          callback(parseInt(data.SearchResponse.Web.Total), data);
        });
      }
    }
// ==============================================================================
  }
})();
