module('SG')

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
      ok(typeof data.responseData.cursor.estimatedResultCount != 'undefined', 'Response OK');
    } catch(e) {
      ok(false, 'Response not of expected format')
    }
    start();
  });
});

asyncTest('bing search response', function() {
  SG.search.bing('Hello Bing', function(data) {
    try {
      ok(typeof data.SearchResponse.Web.Total != 'undefined', 'Response OK');
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

test('query substitute', function() {
  sub = SG.query.substitute;
  equals(sub('<x>',5),'5');
  equals(sub('I have <x> problems', 99), 'I have 99 problems');
  equals(sub('<x>x<x>=25',5), '5x5=25');
});

test('query valid', function() {
  valid = SG.query.valid;
  equals(valid('<x>'),true);
  equals(valid('I have <x> problems'), true);
  equals(valid('<x>x<x>=25'), true);
  equals(valid('Nothing in here'), false);
  equals(valid('I have <x > problems'), false);
});

var test_helper = {
  buildTable: function() {
    return $.mktag('table').append(
      $.mktag('thead').append(
        $.mktag('tr').append(
          $.mktag('th').text("Engine")
        ).append(
          $.mktag('th').text("<x>")
        ).append(
          $.mktag('th').text("# Results")
        )
      )
    ).append(
      $.mktag('tbody')
    );
  }
}

test('addToTable', function() {
  $.mktag('#tableTest').append(test_helper.buildTable()).appendTo('body');
  
  SG.addToTable("google",99,1000,'#tableTest table');
  SG.addToTable("yahoo",97,9000,'#tableTest table');
  equals($("#tableTest table tbody tr").length,2);
  equals($("#tableTest table tbody tr td").length,6);

  $('#tableTest').remove();
});

test('invalid run', function() {
  var pass = function(){};
  equals(SG.validateAndRun('Invalid query',0,5,1,["google"],pass).length,1);
  equals(SG.validateAndRun('<x>',5,0,1,["google"],pass).length,1);
  equals(SG.validateAndRun('<x>',0,5,-1,["google"],pass).length,1);
  equals(SG.validateAndRun('<x>',5,0,-1,["google"],pass).length,2);
  equals(SG.validateAndRun('<x>','a',5,1,["google"],pass).length,1);
});

asyncTest('valid run', function() {
  $.mktag('#runTest',{style: 'display:none'}).append(test_helper.buildTable()).appendTo('body');
  $.mktag('#graphTest').appendTo("body");

  SG.validateAndRun('I have <x> arms',0,5,1, ["google","yahoo"], function(engine,x,numResults,done) {
    SG.addToTable(engine,x,numResults, "#runTest table");
    if (done) {
      SG.graph("graphTest");
      equals($("#runTest table tbody tr").length,12);
      $("#runTest").remove();
      $("#graphTest").remove();
      start();
    }
  });

});
