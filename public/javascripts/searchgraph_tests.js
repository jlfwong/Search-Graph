module('searchgraph')

asyncTest('yahoo search response', function() {
  SG.search.yahoo('Hello Yahoo', function(data) {
    try {
      ok(typeof data.ysearchresponse.totalhits != 'undefined', 'Response OK');
    } catch(e) {
      ok(false, 'Response not of expected format');
    }
    start();
  });
});

asyncTest('google search response', function() {
  SG.search.google('Hello Google', function(data) {
    try {
      ok(typeof data.responseData.cursor.estimatedResultCount != undefined, 'Response OK');
    } catch(e) {
      ok(false, 'Response not of expected format')
    }
    start();
  });
});

asyncTest('bing search response', function() {
  SG.search.bing('Hello Bing', function(data) {
    try {
      ok(typeof data.SearchResponse.Web.Total != undefined, 'Response OK');
    } catch(e) {
      ok(false, 'Response not of expected format')
    }
    start();
  });
});

asyncTest('google numResults response', function() {
  SG.numResultsFrom.google('Hello Google', function(num, data) {
    equals(typeof num, 'number');
    ok(!isNaN(num), "# Results: " + num);
    notEqual(num, 0);
    start();
  });
});

asyncTest('yahoo numResults response', function() {
  SG.numResultsFrom.yahoo('Hello Yahoo', function(num, data) {
    equals(typeof num, 'number');
    ok(!isNaN(num), "# Results: " + num);
    notEqual(num, 0);
    start();
  });
});

asyncTest('bing numResults response', function() {
  SG.numResultsFrom.bing('Hello bing', function(num, data) {
    equals(typeof num, 'number');
    ok(!isNaN(num), "# Results: " + num);
    notEqual(num, 0);
    start();
  });
});
