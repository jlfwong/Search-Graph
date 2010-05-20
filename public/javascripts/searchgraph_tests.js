module("searchgraph")

test("set up", function() {
  ok(typeof SG != 'undefined', "SG");
  ok(typeof SG.search != 'undefined', "SG.search");
  var engines = new Array("yahoo","google","bing");
  for (var i in engines) {
    equal(typeof SG.search[engines[i]],'function', "SG.search."+engines[i]);
  }
});

