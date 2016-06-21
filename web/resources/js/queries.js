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
    {id:4,descrizione: "PREFIX space: <http://purl.org/net/schemas/space/>\nSELECT ?craft\n{\n ?craft a space:Spacecraft\n}"}
];

//var id= inserire qui dentro l'id della query selezionata nello spinner
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

var sendEditorContent = function() {
    var x = yasqe.getValue();
    endPoint += "/query?id=[id]&view="+x;
}

var createQueryList = function () {
    var editDiv = document.getElementById("editDiv");
    var selectQueryList = document.getElementById("selectQueryList");
    //selectQueryList.id = "selectQueryList";
    //selectQueryList.class = "form-control";
    //selectQueryList.onchange = "querySelected()";
    //editDiv.appendChild(selectQueryList);

    for (var i = 0; i < csv.length; i++) {
        var option = document.createElement("option");
        option.value = csv[i].id;
        option.text = csv[i].nome;
        selectQueryList.appendChild(option);
    }
}