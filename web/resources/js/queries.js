//csv che era nel formato: id,nome,id,nome,id,nome...
//viene parsato in un array di oggetti ognuno dei quali contiene id e nome
var csv= [
    {id:1,nome:Automobili},
    {id:2,nome:Nazioni},
    {id:3,nome:Nascite},
    {id:4,nome: "Case costruite nel 2003"}
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