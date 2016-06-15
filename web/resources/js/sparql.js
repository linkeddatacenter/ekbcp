var yasgui;
var userName, passWord, endPoint;
var tabz;
$(document).ready(function() {
    //There is some text on the HTML which we'll need to fill dynamically from javascript:
    $("#actualEndpoint").text(sparql.endpoint).attr("href", sparql.endpoint);

    //get the username and password value in the inputs
    userName = document.getElementById("ekbUser").value;
    passWord = document.getElementById("ekbPassword").value;
    endPoint = document.getElementById("actualEndpoint").value;


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


    //Only to see if the encryption goes
    //(add this in index.html before run: <span id="prova"></span> )
    // var end = document.getElementById("prova");
    // end.innerHTML = authentication + " " + atob(authentication) +
    // " " + userName + ":" + passWord;
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

var resetParams=function () {  //funzione da terminare
    for (var tabId in yasgui.tabs) {
        var tab = yasgui.tabs[tabId];
        tab.persistentOptions.yasqe.sparql.endpoint = document.getElementById("actualEndpoint").value;
        tab.refreshYasqe();
    }
}