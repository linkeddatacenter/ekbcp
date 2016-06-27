var id;
var yasqe;
$(document).ready(function () {
    //There is some text on the HTML which we'll need to fill dynamically from javascript:
    $("#actualEndpoint").text(sparql.endpoint).attr("href", sparql.endpoint);

    //get the username, password and endpoint value in the inputs
    userName = document.getElementById("ekbUser").value;
    passWord = document.getElementById("ekbPassword").value;
    endPoint = document.getElementById("actualEndpoint").value;

    //if the endpoint insert is equal to the default
    //it insert the /queries for go to the database
    if (endPoint == "https://hub1.linkeddata.center/demo") {
        endPoint += "/queries";
    }
    createQueryList();
});

var createQueryList = function () {
    var editDiv = document.getElementById("editDiv");
    var selectQueryList = document.getElementById("selectQueryList");
    $.ajax({
        type: 'GET',
        url: endPoint+"/queries",
        //url: "../doc/tests/queryList.txt",
        headers: {
            Accept: "text/csv; charset=utf-8",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache: false,
        success: function (data) {
            var queryList = CSV.parse(data);
            for (var i in queryList) {
                var row = queryList[i];
                var option = document.createElement("option");
                option.value = row[0]; // uri
                option.text = row[2]; // label
                selectQueryList.appendChild(option);

            }
            id = selectQueryList.value;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("" + xhr.status + thrownError);
        }
    });
}

var getDescriptionFromId = function () {
    id = document.getElementById("selectQueryList").value;
    var descr;
    $.ajax({
        type: 'GET',
        url: endPoint + "/querystore?query=" + id + "&view=description",
        //url: "../doc/tests/queryDescription.txt",
        headers: {
            Accept: "text/turtle; charset=utf-8",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache: false,
        success: function (data) { 
        	document.getElementById("description").innerHTML = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("" + xhr.status + thrownError);
        }

    });
}

var getQueryParams = function () {
    var params = document.getElementById("inputParameters").value;
    return params;
}

//function called when pressed set credential
var resetParams = function () {
    writeCookie();
    location.reload(true);
}

var sendToEditorSparql = function () {
    //build an http get to request the list of ingestion in CSV format
    $.ajax({
        type: 'GET',
        url: endPoint+"/querystore?query=" + id + "&view=sparql&" + getQueryParams(),
        //url: "../doc/tests/invioQuerySPARQL.txt",
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache: false,
        success: function (data) {
            window.open("index.html?query=" + data, "_self")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("" + xhr.status + thrownError);
        }
    });
}