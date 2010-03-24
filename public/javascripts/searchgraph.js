// GOOGLE AJAX SEARCH API
/*
google.load("search", "1");
var searchControl;
function OnLoad() {
	searchControl = new google.search.SearchControl();
	searchControl.addSearcher(new google.search.WebSearch());

	console.log(searchControl);
	//searchControl.setSearchStartingCallback(searchControl, function(a,b) { alert(a); });
	searchControl.execute("fire");
}
google.setOnLoadCallback(OnLoad);
*/
// END GOOGLE AJAX SEARCH API

$(document).ready(function() {
	$("#start:input").click(start);
	$("form#searchRequest").submit(start);
	$(":input").attr("disabled",false);
	$("div#progressBar").progressBar();
	$("table#dataTable").tablesorter({0: {sorter: "digit"}, 1: {sorter: "digit"}});
	$("#use_api:input").attr("checked",true);
})

var state = {
	numRequests: 0,
	dataReceived: [],
	query: "",
	error: false
};

function round1(num) {
	return Math.round(num*100)/100.0;
}

function start() {
	//alert("Start");
	var query = $("#query:input").attr("value");
	var lower = parseFloat($("#lower:input").attr("value"));
	var upper = parseFloat($("#upper:input").attr("value"));
	var step = parseFloat($("#step:input").attr("value"));
	if (step <= 0) {
		alert("Step must not be negative");
		return false;
	};

	//alert(lower + "," + upper + "," + step);


	var numRequests = Math.floor((upper - lower)/step) + 1;
	/*
	if (numRequests >= 150) {
		alert("Too many steps requested (" + numRequests + "): Maximum is 150");
		return false;
	}*/
	window.state["numRequests"] = Math.floor((upper - lower)/step) + 1;
	window.state["dataReceived"] = [];
	window.state["query"] = query;
	window.state["error"] = false;

	$("table#dataTable tbody").html("");

	$(":input").attr("disabled",true);
	$("div#progressBar").progressBar(0);

	var targeturl;
	if ($("#use_api:input").attr("checked")) {
		targeturl = "search/google/web/api";
	} else {
		targeturl = "search/google/web/scrape";
	}

	for (var i = lower; i <= upper; i+= step) {
		/*if (typeof console != undefined) {
			console.log("search/google/web/?q="+ query.replace("<x>",i));
		}*/

		$.ajax({
			url      : targeturl,
			data     : { q: query.replace("<x>",i), it: i },
			success  : searchCallback, 
			complete : function(HttpRequest, responseCode) {
				if (responseCode == "error") {
					if (window.state["error"] == false) {
						window.state["error"] = true;
						alert("Failed to retrieve results. Server is busy or unavailable.");
					}
				}
			},
			cache    : false,
			dataType : "json"
		});
	}
	return false;
}

function searchCallback(data) {
	if (data["error"] != "none") {
		if (window.state["error"] == false) {
			window.state["error"] = true;
			alert(data["error"]);
		}
		return false;
	}
	//alert(window.state["dataReceived"].length);
	window.state["dataReceived"].unshift([data["iterator"],data["numResults"]]);
	$("table#dataTable tbody").append(
		$(document.createElement("tr")).append(
			$(document.createElement("td")).append(
				$(document.createElement("a")).attr({
					href: "http://google.com/search?q=" + window["state"].query.replace("<x>",data["iterator"]),
					target: "_blank"
				}).text(data["iterator"])
			)
		).append(
			$(document.createElement("td")).text(data["numResults"])
		)
	);

	
	$("table#dataTable tr:last td").css("backgroundColor","#9d9").delay(100).animate({backgroundColor: "white"}, 800); 

	$("table#dataTable").trigger("update");
	$("table#dataTable").trigger("sorton",[[[0,0]]]);


	$("div#progressBar").progressBar(100.0 * window.state["dataReceived"].length / window.state["numRequests"]);
	if (window.state["dataReceived"].length == window.state["numRequests"]) {
		$("div#progressBar").progressBar(100);

		dataReceived = window.state["dataReceived"].sort(function(a,b) {return a[0]-b[0]});
		$(":input").attr("disabled",false);

		/*
		cht = s
		chxt = x,y
		chxr = 0,<minx> - 1,<maxx> + 1 | 1, 0, <maxy>*1.1
		chd = t: <xlist>|<ylist>
		chs = 200x200

		*/

		var xlist = "";
		var ylist = "";
		var minx = dataReceived[0][0];
		var maxx = dataReceived[dataReceived.length - 1][0];
		var maxy = 0;

		for (var j = 0; j < dataReceived.length; j++) {

			if (parseInt(dataReceived[j][1]) > maxy) {
				maxy = dataReceived[j][1];
			}
		}

		maxy = Math.max(1,maxy);

		//var width = Math.max(200,Math.min((maxx - minx) * 20,500))
		var width = 400;
		var height = 400;

		for (var j = 0; j < dataReceived.length; j++) {
			if (xlist != "" && ylist != "") {
				xlist += ",";
				ylist += ",";
			}
			xlist += round1(parseFloat(dataReceived[j][0] - minx)/(maxx - minx) * 100);
			ylist += round1(parseFloat(dataReceived[j][1])/maxy * 100)
		}

		var chartURI = "http://chart.apis.google.com/chart?";
		chartURI += "cht=s";
		chartURI += "&chtt=" + window.state["query"].replace(" ","+")
		chartURI += "&chxt=x,x,y,y";
		var xstep = Math.max(parseInt((maxx - minx)/20),1);
		chartURI += "&chxl=1:|x|3:|%23+Results&chxp=1,50|3,50";
		chartURI += "&chxr=0," + minx + "," + maxx + "," + xstep + "|2,0," + maxy + "," + maxy/10
		chartURI += "&chd=t:" + xlist + "|" + ylist;
		chartURI += "&chs=" + width + "x" + height;
		chartURI += "&chg=" + round1(100.0 / ((maxx - minx)/xstep)) + ",10";

		$("img#chartImg").attr("src",chartURI);	
	}
}


