$(document).ready(function() {
	$("#start:input").click(start);
	$("form#searchRequest").submit(start);
	$(":input").attr("disabled",false);
	$("div#progressBar").progressBar();
})

var state = {
	numRequests: 0,
	dataReceived: [],
	query: ""
};

function round1(num) {
	return Math.round(num*100)/100.0;
}

function start() {
	//alert("Start");
	var query = $("#query:input").attr("value");
	var lower = parseInt($("#lower:input").attr("value"));
	var upper = parseInt($("#upper:input").attr("value"));
	var step = parseInt($("#step:input").attr("value"));

	//alert(lower + "," + upper + "," + step);

	window.state["numRequests"] = Math.floor((upper - lower + 1)/step);
	window.state["dataReceived"] = [];
	window.state["query"] = query;

	$(":input").attr("disabled",true);
	$("div#progressBar").progressBar(0);

	for (var i = lower; i <= upper; i+= step) {
		/*if (typeof console != undefined) {
			console.log("search/google/web/?q="+ query.replace("<x>",i));
		}*/

		$.get("search/google/web/",
			{
				q: query.replace("<x>",i),
				it: i
			},
			searchCallback, 
			"json"
		);
	}
	return false;
}

function searchCallback(data) {
	//alert(window.state["dataReceived"].length);
	window.state["dataReceived"].unshift([data["iterator"],data["numResults"]]);

	$("div#progressBar").progressBar(100.0 * window.state["dataReceived"].length / window.state["numRequests"]);
	if (window.state["dataReceived"].length == window.state["numRequests"]) {

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


