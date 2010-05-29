SG = (function() {
  this.engines = ["yahoo","google","bing"];
  var waiting_on = 0;
  var results = new Array();

  $(document).ready(function() {
    var form = $("form#SG_input");
    form.submit(function() {
      $("table#SG_table tbody").html("");
      var queryTemplate = form.find("#query_template").val();
      var lowerBound = form.find("#lower_bound").val();
      var upperBound = form.find("#upper_bound").val();
      var step = form.find("#step").val();
      var all_engines = ["yahoo","google","bing"];
      var engines = [];
      for (x in all_engines) {
        if (form.find("#" + all_engines[x]).attr('checked')) {
          engines.push(all_engines[x]);
        }
      }
      $("#SG_progress").css("width","0");
      var errors = SG.validateAndRun(queryTemplate, lowerBound, upperBound, step, engines, 
      function(engine,x,numResults,done) {
        SG.addToTable(engine,x,numResults,"table#SG_table");
        $("#SG_progress").css("width",((1 - (SG.waiting_on / SG.numRequests)) * 100) + "%");
        if (done) {
          SG.graph("SG_graph");
        }
      });

      if (errors.length) {
        alert(errors[0]);
      } 
      return false;
    });
  });

  return {
// ==============================================================================
    graph: function(divId, title) {
      $("#" + divId).text('');
      var r = Raphael(divId);
      r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
      

      var x = [], y = [], engines = [];

      for (i in SG.results) {
        var curx = [], cury = [];
        engines.push(i);
        for (j in SG.results[i]) {
          var dataPt = SG.results[i][j];
          curx.push(dataPt[0]);
          cury.push(dataPt[1]);
        }
        x.push(curx);
        y.push(cury);
      }
      
      r.g.linechart(60,10,300,300,x,y,{
        nostroke: false,
        axis: "0 0 1 1",
        symbol: 'o',
        legend: engines, 
        legendpos: "east"
      }).hoverColumn(function() {
        this.tags = r.set();
        for (var i = 0, ii = this.y.length; i < ii; i++) {
          this.tags.push(r.g.tag(this.x,this.y[i],'(' + this.valuesx[i] + ',' + this.values[i] + ')',160,10)
            .insertBefore(this)
            .attr([{fill: "#fff"}, {fill: this.symbols[i].attr("fill")}]));
        }
      },function() {
        if(this.tags) this.tags.remove();
      });
    },
// ==============================================================================
    addToTable: function(engine, x, numResults, table) {
      $(table).children('tbody').append(
        $.mktag("tr").append(
          $.mktag("td").text(engine)
        ).append(
          $.mktag("td").text(x)
        ).append(
          $.mktag("td").text(numResults)
        )
      );
    },
// ==============================================================================
    query: {
      substitute: function(query, x) {
        return query.replace(/<x>/g,x);
      },
      valid: function(query,x) {
        return (query.match(/<x>/,x) !== null);
      }
    },
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
// ------------------------------------------------------------------------------
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
          var numResults = parseInt(data.responseData.cursor.estimatedResultCount);
          if (data.responseData.results.length == 0) numResults = 0
          callback(numResults, data);
        });
      },
// ------------------------------------------------------------------------------
      bing: function(query, callback) {
        SG.search.bing(query, function(data) {
          callback(parseInt(data.SearchResponse.Web.Total), data);
        });
      }
// ------------------------------------------------------------------------------
    },
// ==============================================================================
    run: function(queryTemplate, lowerBound, upperBound, step, engines, callback) {
      // callback: function(string engine,number x,number numResults,bool done)
      SG.numRequests = ((upperBound - lowerBound)/step + 1) * engines.length;
      SG.waiting_on = SG.numRequests;
      SG.results = new Array();

      for (x in engines) {
        engine = engines[x];
        for (var x = lowerBound; x <= upperBound; x += step) {
          var query = SG.query.substitute(queryTemplate,x);
          SG.numResultsFrom[engine](query, (function() {
            var curx = x;
            var curengine = engine;
            if (typeof SG.results[engine] == 'undefined') {
              SG.results[engine] = new Array();
            }

            return function(numResults) {
              SG.results[curengine].push([curx,numResults]);
              SG.waiting_on -= 1;
              callback(curengine,curx,numResults,SG.waiting_on == 0);
            }
          })());
        }
      }
    },
// ==============================================================================
    validateAndRun: function(queryTemplate, lowerBound, upperBound, step, engines, callback) {
      var errors = new Array();

      lowerBound = parseFloat(lowerBound);
      upperBound = parseFloat(upperBound);
      step = parseFloat(step);

      if (!SG.query.valid(queryTemplate)) {
        errors.push("Invalid query template");
      }
      if (isNaN(lowerBound) || isNaN(upperBound) || isNaN(step)) {
        errors.push("Lower bound, upper bound and step all must be numbers");
      } else {
        if (upperBound < lowerBound) {
          errors.push("Lower bound must be less than upper bound");
        }
        if (step <= 0) {
          errors.push("Step must be positive");
        } 
      }
      if (typeof callback !== 'function') {
        errors.push("Callback must be a function");
      }
      if (errors.length == 0) {
        SG.run(queryTemplate,lowerBound,upperBound,step, engines, callback);
      }

      return errors;
    }
// ==============================================================================
  }
})();
