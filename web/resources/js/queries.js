//csv che era nel formato: id,nome,id,nome,id,nome...
//viene parsato in un array di oggetti ognuno dei quali contiene id e nome
var csv= [
    {id:1,nome:"Automobili"},
    {id:2,nome:"Nazioni"},
    {id:3,nome:"Nascite"},
    {id:4,nome: "Case costruite nel 2003"}
];

//csv che era nel formato: id,descrizione,id,descrizione,id,descrizione...
//viene parsato in un array di oggetti ognuno dei quali contiene id e descrizione
var csvDescizione= [
    {id:1,descrizione:"PREFIX foaf: <http://xmlns.com/foaf/0.1/>\nSELECT ?craft ?homepage\n{\n?craft foaf:name \"Apollo 7\" .\n?craft foaf:homepage ?homepage\n}"},
    {id:2,descrizione:"PREFIX foaf:  <http://xmlns.com/foaf/0.1/>\nPREFIX card: <http://www.w3.org/People/Berners-Lee/card#>\nSELECT ?homepage\n FROM <http://www.w3.org/People/Berners-Lee/card>\nWHERE {\ncard:i foaf:knows ?known .\n?known foaf:homepage ?homepage .\n}"},
    {id:3,descrizione:"SELECT DISTINCT ?concept\nWHERE {\n?s a ?concept .\n}"},
    {id:4,descrizione:"PREFIX space: <http://purl.org/net/schemas/space/>\nSELECT ?craft\n{\n ?craft a space:Spacecraft\n}"}
];

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

    YASQE.defaults.sparql.endpoint = endPoint;
    //create a string coded https://it.wikipedia.org/wiki/Basic_access_authentication
    YASQE.defaults.sparql.headers = {Authorization: 'Basic ' + btoa(userName + ":" + passWord)};
    YASQE.defaults.value = /*sparql.prefixes +*/
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
    });
});

var createQueryList = function () {
    var editDiv = document.getElementById("editDiv");
    var selectQueryList = document.getElementById("selectQueryList");
    $.ajax({
        type: 'GET',
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
        url: "../doc/tests/queryDescription.txt",
        headers: {
            Accept : "text/csv; charset=utf-8",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache:false,
        success: function(data){
            var queryList=CSV.parse(data);
            for(var i in queryList ) {
                var row = queryList[i];
                if (row[0] == id) {
                    descr = row[1];
                    yasqe.setValue(descr);
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
    var old = yasqe.getValue();
    yasqe.setValue(old + "\n" + params);
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
        //url: endPoint+"/queries?id=$id&view=source",  //ricordati di mettere dentro la var id globale l'id della query selezionata nello spinner
        url: "../doc/tests/invioQuerySPARQL.txt",
        headers: {
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        cache:false,
        success: function(data ){
            window.open("index.html?query="+data,"_self")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(""+xhr.status +thrownError);
        }
    });
}