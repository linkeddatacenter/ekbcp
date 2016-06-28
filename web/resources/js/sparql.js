//reassign the endpoint and the Authorization header
//everytime there is a change on one of the inputs
var resetParams=function () {
	writeCookie();
    for (var tabId in yasgui.tabs) {
       yasgui.closeTab(tabId);
    }
    location.reload(true);

};

var yasgui;

// TODO: not on document ready but on main ready
$(document).ready(function() {
    //get the username, password and endpoint value in the inputs
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var sparqlEndPoint = document.getElementById("ekbEndpoint").value + '/sparql';
    var namedGraphs = getUrlParams("named-graph-uri");
    
    //There is some text on the HTML which we'll need to fill dynamically from javascript:
    //TODO: what doses it means?????
    $("#actualEndpoint").text(sparqlEndPoint).attr("href", sparqlEndPoint);

    YASGUI.YASQE.defaults.sparql.namedGraphs = namedGraphs;
    YASGUI.YASQE.defaults.sparql.endpoint = sparqlEndPoint;
    //create a string coded https://it.wikipedia.org/wiki/Basic_access_authentication
    YASGUI.YASQE.defaults.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
    YASGUI.YASQE.defaults.value = 
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
