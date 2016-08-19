//function called when pressed set credential
var resetParams = function () {
    writeCookie();
    location.reload(true);
}

var config = {
    delimiter: ",",	// auto-detect
    newline: "",	// auto-detect
    header: false,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    skipEmptyLines: true,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined
}

var onCreate=function () {
    createQueryList();
};

var createQueryList = function () {
    var editDiv = document.getElementById("editDiv");
    var selectQueryList = document.getElementById("selectQueryList");
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var ekbEndPoint = document.getElementById("ekbEndpoint").value;
    
    $.ajax({
        type: 'GET',
        url: ekbEndPoint + "/queries",
        headers: {
            Accept: "text/csv",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) {
            var queryList = Papa.parse(data, config);
            var dati = queryList.data;
            for(var i = 1; i < dati.length-1 ; ++i){
                var element = dati[i];
                var option = document.createElement("option");
                option.value = element[0]; // uri
                option.text = element[2]; // label
                selectQueryList.appendChild(option);
            }
            getDescriptionFromId(selectQueryList.value);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading kb queries : " + xhr.status + " " + thrownError + + xhr.responseText);
        }
    });
}

var getDescriptionFromId = function (uri) {
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var ekbEndPoint = document.getElementById("ekbEndpoint").value;
    $.ajax({
        type: 'GET',
        url: ekbEndPoint + "/querystore?query=" + encodeURIComponent(uri) + "&view=description",
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) { 
        	document.getElementById("description").innerHTML = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading query description : " + xhr.status + " " + thrownError + xhr.responseText);
        }
    });
}


var sendToEditorSparql = function (uri) {
	var params = document.getElementById("inputParameters").value;
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var ekbEndPoint = document.getElementById("ekbEndpoint").value;
    //build an http get to request the list of ingestion in CSV format
    $.ajax({
        type: 'GET',
        url: ekbEndPoint+"/querystore?query=" + encodeURIComponent(uri) + "&view=sparql&" + params,
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) {
            window.open("index.html?query=" + encodeURIComponent(data), "_self")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error exploding parametric query : " + xhr.status + thrownError + xhr.responseText);
        }
    });
}
