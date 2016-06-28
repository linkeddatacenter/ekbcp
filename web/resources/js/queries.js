//function called when pressed set credential
var resetParams = function () {
    writeCookie();
    location.reload(true);
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
            var queryList = CSV.parse(data);
            for (var i in queryList) {
                if (i > 0) {
                    var row = queryList[i];
                    var option = document.createElement("option");
                    option.value = row[0]; // uri
                    option.text = row[2]; // label
                    selectQueryList.appendChild(option);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading kb queries : " + xhr.status + thrownError);
        }
    });
}

var getDescriptionFromId = function (uri) {
    $.ajax({
        type: 'GET',
        url: endPoint + "/querystore?query=" + encodeURIComponent(uri) + "&view=description",
        headers: {
            Accept: "text/turtle",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) { 
        	document.getElementById("description").innerHTML = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading query description : " + xhr.status + thrownError);
        }
    });
}


var sendToEditorSparql = function (uri) {
	var params = document.getElementById("inputParameters").value;
    //build an http get to request the list of ingestion in CSV format
    $.ajax({
        type: 'GET',
        url: endPoint+"/querystore?query=" + encodeURIComponent(uri) + "&view=sparql&" + params,
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) {
            window.open("index.html?query=" + data, "_self")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error exploding parametric query : " + xhr.status + thrownError);
        }
    });
}