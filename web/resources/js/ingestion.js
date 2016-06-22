$(document).ready(function() {
    //get the username, password and endpoint value in the inputs
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var endPoint = document.getElementById("actualEndpoint").value;
    //endPoint="http://127.0.0.1";//for test
    
    //build an http get to request the list of ingestion in CSV format
	$.ajax({
        type: 'GET',
		url: endPoint+"/queries",
        headers: {
				Accept : "text/csv; charset=utf-8",
				Authorization: 'Basic ' + btoa(userName + ":" + passWord)
		},
		cache:false,
		success: function(data ){
				var tableRows=CSV.parse(data);

				for(var i in tableRows ){
					var row=tableRows[i];
					document.getElementById("ingestionTable").innerHTML+=
                        "<tr>" +
                            "<td>"+row[0]+"</td>" +
                            "<td>"+row[1]+"</td>" +
                            "<td>"+row[2]+"</td>" +
                            "<td>"+row[3]+"</td>" +
                            "<td>"+row[4]+"</td>" +
                            "<td>" +
                                "<a href='"+endPoint+"/query/"+row[0]+"' target='_blank'><button><b>i</b></button></a>"//ingestion report link
                            "</td>" +
                        "</tr>";
				}
			},
		error: function (xhr, ajaxOptions, thrownError) {
			alert(""+xhr.status +thrownError);
		}
	});



});

//sent a new injestion to the endpoint
var submitPressed = function() {
	var selectedValue =$('#plan').find(":selected").text();
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var endPoint = document.getElementById("actualEndpoint").value;
    //endPoint="http://127.0.0.1";//for test
    
    //build an http post to send the selected plan to the endpoint
	$.ajax({

		url: endPoint + '/activites',
		type: 'POST',
		data: selectedValue,
		headers: {
			Authorization: 'Basic ' + btoa(userName + ':' + passWord),
			Accept : 'text/csv; charset=utf-8',
			'Content-Type' : 'text/plain; charset=utf-8'
		},
        cache:false,
        success: function(data ){
            location.reload(true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(""+xhr.status +" "+thrownError );
        }
	});
}

//function called when refresh button in the table header is pressed
var refreshTable = function() {
	location.reload(true);
}

//function called when pressed set credential
var resetParams = function() {
	writeCookie();
	location.reload(true);
}
