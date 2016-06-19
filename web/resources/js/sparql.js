var yasgui;
var userName, passWord, endPoint;
var tabz;
$(document).ready(function() {
    //There is some text on the HTML which we'll need to fill dynamically from javascript:
    $("#actualEndpoint").text(sparql.endpoint).attr("href", sparql.endpoint);

    //get the username, password and endpoint value in the inputs
    userName = document.getElementById("ekbUser").value;
    passWord = document.getElementById("ekbPassword").value;
    endPoint = document.getElementById("actualEndpoint").value;
	
	//if the endpoint insert is equal to the default
	//it insert the /sparql for go to the database
	if (endPoint == "https://hub1.linkeddata.center/demo") {
		endPoint += "/sparql";
	}

    var namedGraphs = getUrlParams("named-graph-uri");
    //var defaultGraphs = [sparql.graphs.main, sparql.graphs.seedlist, sparql.graphs.metrics, sparql.graphs.error, sparql.graphs.http];
    var defaultGraphs = [];

    YASGUI.YASQE.defaults.sparql.namedGraphs = namedGraphs;
    YASGUI.YASQE.defaults.sparql.defaultGraphs = defaultGraphs;
    YASGUI.YASQE.defaults.sparql.endpoint = endPoint;
    //create a string coded https://it.wikipedia.org/wiki/Basic_access_authentication
    YASGUI.YASQE.defaults.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
    YASGUI.YASQE.defaults.value = /*sparql.prefixes +*/
        "SELECT DISTINCT ?namedGraph {\n"+
        "	GRAPH ?namedGraph {\n" +
        "		?subject ?predicate ?object \n" +
        "	} \n" +
        "} LIMIT 10";
    yasgui = YASGUI(document.getElementById("sparql"));
});

var getUrlParams = function(key) {
    var values = [];
    var pageUrl = window.location.search.substring(1);
    var chunks = pageUrl.split('&');
    for (var i = 0; i < chunks.length; i++) {
        var paramName = chunks[i].split('=');
        if (paramName[0] == key) {
            values.push(decodeURIComponent(paramName[1]));
        }
    }
    return values;
};

//disable regular lodlaundromat loader behaviour
$.ajaxSetup({
    beforeSend: function() {

    },
});

//reassign the endpoint and the Authorization header
//everytime there is a change on one of the inputs
var resetParams=function () {
	userName = document.getElementById("ekbUser").value;
	passWord = document.getElementById("ekbPassword").value;
	endPoint = document.getElementById("actualEndpoint").value;
	
	if (endPoint == "https://hub1.linkeddata.center/demo") {
		endPoint += "/sparql";
	}
	
    for (var tabId in yasgui.tabs) {
        var tab = yasgui.tabs[tabId];
        tab.persistentOptions.yasqe.sparql.endpoint = endPoint;
        tab.persistentOptions.yasqe.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
        tab.refreshYasqe();
    }
	
	var cookieName = "credentialCookie";
    var cookieValue = endPoint+" "+userName+" "+passWord;
    var cookieLife = 14400; //14400 minute = 1 day
    writeCookie(cookieName, cookieValue, cookieLife);
}

var writeCookie = function(name,value,life){
     var d = new Date();
     d.setTime(d.getTime() + (life*24*60*60*1000));
     var expires = "expires="+ d.toUTCString();
     document.cookie = name + "=" + value + "; " + expires;
}