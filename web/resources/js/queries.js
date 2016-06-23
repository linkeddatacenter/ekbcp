var id;
var yasqe;
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
        endPoint += "/queries";
    }
    createQueryList();

    /*YASQE.defaults.sparql.endpoint = endPoint;
    //create a string coded https://it.wikipedia.org/wiki/Basic_access_authentication
    YASQE.defaults.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
    YASQE.defaults.value = /!*sparql.prefixes +*!/
        "SELECT DISTINCT ?namedGraph {\n"+
        "	GRAPH ?namedGraph {\n" +
        "		?subject ?predicate ?object \n" +
        "	} \n" +
        "} LIMIT 10";
    yasqe = YASQE(document.getElementById("queries"), {
        sparql: {
            showQueryButton: false,
            callbacks:{
                success: function(data){
                    console.log("success", data);
                }
            }
        }
    });*/
});

var createQueryList = function () {
    var editDiv = document.getElementById("editDiv");
    var selectQueryList = document.getElementById("selectQueryList");
    $.ajax({
        type: 'GET',
        //url: endPoint+"/queries",
        url: "../doc/tests/queryList.txt",
        headers: {
            Accept : "text/csv; charset=utf-8",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache:false,
        success: function(data){
            var queryList=CSV.parse(data);
            for(var i in queryList ){
                var row=queryList[i];
                var option = document.createElement("option");
                option.value = row[0];
                option.text = row[1];
                selectQueryList.appendChild(option);

            }
            id = selectQueryList.value;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(""+xhr.status +thrownError);
        }
    });
    //selectQueryList.id = "selectQueryList";
    //selectQueryList.class = "form-control";
    //selectQueryList.onchange = "querySelected()";
    //editDiv.appendChild(selectQueryList);


}

var getDescriptionFromId = function(){
    // for (var i = 0; i < csvDescizione.length; i++) {
    //     if(csvDescizione[i].id == id){
    //         var descr = csvDescizione[i].descrizione;
    //         return descr;
    //     }
    // }
    // return "null";
    id = document.getElementById("selectQueryList").value;
    var descr;
    $.ajax({
        type: 'GET',
        //url: endPoint+"/queries?id=$id&view=source",
        url: "../doc/tests/queryDescription.txt",
        headers: {
            Accept : "text/csv; charset=utf-8",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache:false,
        success: function(data){ //non serve fare il parser perchè chiamiamo solo una query alla volta attraverso l'id alle api
            var queryList=CSV.parse(data);
            for(var i in queryList ) {
                var row = queryList[i];
                if (row[0] == id) {
                    descr = row[1];
                    document.getElementById("description").innerHTML=descr;
                    /*var x = descr.split("£");
                    for(var j = 0; j < x.length; ++j){
                        if(j==0){
                            yasqe.setValue(x[j]);
                        } else {
                            var old = yasqe.getValue();
                            yasqe.setValue(old + "\n" + x[j]);
                        }
                    }*/
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(""+xhr.status +thrownError);
        }

    });
}

var setQueryParams = function () {
    var params = document.getElementById("inputParameters").value;
    return params;
}

//function called when pressed set credential
var resetParams = function() {
    writeCookie();
    location.reload(true);
}

var sendToEditorSparql=function(){
    //build an http get to request the list of ingestion in CSV format
    $.ajax({
        type: 'GET',
        //url: endPoint+"/queries?id=$"+id+"&view=source",  //ricordati di mettere dentro la var id globale l'id della query selezionata nello spinner
        url: "../doc/tests/invioQuerySPARQL.txt",
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache:false,
        success: function(data ){
            window.open("index.html?query="+data+"?"+setQueryParams(),"_self")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(""+xhr.status +thrownError);
        }
    });
}