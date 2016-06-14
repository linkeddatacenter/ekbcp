var yasgui;
var userName, passWord, endPoint;
var tabz;
$(document).ready(function() {
    console.log(queryDefaultValues.endpoint);
    //There is some text on the HTML which we'll need to fill dynamically from javascript:
    // $("#actualEndpoint").text(queryDefaultValues.endpoint).attr("href", queryDefaultValues.endpoint);

    //get the username and password value in the inputs
    userName = document.getElementById("ekbUser").value;
    passWord = document.getElementById("ekbPassword").value;
    endPoint = document.getElementById("actualEndpoint").value;

    //create a string coded with Base64
    //with the username and password separate with :
    var authentication = btoa(userName + ":" + passWord);
    var base = "Basic " + authentication;

    var namedGraphs = getUrlParams("named-graph-uri");
    var defaultGraphs = [sparql.graphs.main, sparql.graphs.seedlist, sparql.graphs.metrics, sparql.graphs.error, sparql.graphs.http];

    YASGUI.YASQE.defaults.sparql.namedGraphs = namedGraphs;
    YASGUI.YASQE.defaults.sparql.defaultGraphs = defaultGraphs;
    YASGUI.YASQE.defaults.sparql.endpoint = "http://linkeddata.center/test.php";
    YASGUI.YASQE.defaults.sparql.headers = {Authorization: base};
    YASGUI.YASQE.defaults.value = /*sparql.prefixes +*/
        "SELECT DISTINCT ?properties ?classes WHERE {\n"+
        "	{[] a ?classes}\n"+
        "	UNION\n"+
        "	{[] ?properties ?x}\n"+
        "} LIMIT 10";
    yasgui = YASGUI(document.getElementById("sparql"));


    //overwrite settings from local storage w.r.t. default graphs (needed when changing crawl version)
    for (var tabId in yasgui.tabs) {
        var tab = yasgui.tabs[tabId];
        if (tab.persistentOptions && tab.persistentOptions.yasqe && tab.persistentOptions.yasqe.sparql) {
            tab.persistentOptions.yasqe.sparql.defaultGraphs = defaultGraphs;
        }
    }

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

