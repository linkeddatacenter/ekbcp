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
var onCreate=function() {
	//get the username, password and endpoint value in the inputs
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
	var sparqlEndPoint = document.getElementById("ekbEndpoint").value;
	var namedGraphs = getUrlParams("named-graph-uri");
	var defaultQuary;
	var urlParam=getUrlParams("operation");
	
	if(urlParam[0]&&urlParam[0]=="update"){
		sparqlEndPoint+="/sparql/update";
		document.getElementById("btnChangeOperation").innerHTML="Switch to query endpoint";
		
	}else{
		sparqlEndPoint+="/sparql";
		document.getElementById("btnChangeOperation").innerHTML="Switch to update endpoint";
		defaultQuary="SELECT DISTINCT ?namedGraph {\n"+
					 "GRAPH ?namedGraph {\n" +
					 "?subject ?predicate ?object \n" +
					 "} \n" +
					 "} LIMIT 10";
		
	}
	
	document.getElementById("usingEndpoint").innerHTML=sparqlEndPoint
	
  
    
    YASGUI.YASQE.defaults.sparql.namedGraphs = namedGraphs;
    YASGUI.YASQE.defaults.sparql.endpoint = sparqlEndPoint;
    //create a string coded https://it.wikipedia.org/wiki/Basic_access_authentication
    YASGUI.YASQE.defaults.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
    YASGUI.YASQE.defaults.value = defaultQuary;
    yasgui = YASGUI(document.getElementById("sparql"));
};

var getUrlParams = function(key) {
    var values = [];
    var pageUrl = window.location.search.substring(1);
    var chunks = pageUrl.split('&');
    for (var i = 0; i < chunks.length; i++) {
        var paramName = chunks[i].split('=');
        if (paramName[0] == key) {
            values.push(paramName[1]);
        }
    }
    return values;
};

var changeOperation = function(){
	 for (var tabId in yasgui.tabs) {
       yasgui.closeTab(tabId);
    }
	var url = window.location.href;
	if(url.indexOf("?")>-1){
		url=url.substring(0,url.indexOf("?"));
	}
	var current=document.getElementById("usingEndpoint").innerHTML;
	if(current.indexOf("/sparql/update")>-1){
		url += "?operation=query";
	}else{
		url += "?operation=update";
	}

	window.location.href = url;
	
}
