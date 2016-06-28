//function called when pressed set credential
var resetParams = function() {
	writeCookie();
	location.reload(true);
}


// TODO: not on document ready but on main ready
var onCreate=function() {
    //get the username, password and endpoint value in the inputs
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var endPoint = document.getElementById("ekbEndpoint").value;
    
    //build an http get to request the list of ingestion in CSV format
	$.ajax({
        type: 'GET',
		url: endPoint + "/activities",
        headers: {
				Accept : "text/csv",
				Authorization: 'Basic ' + btoa(userName + ":" + passWord)
		},
		cache:false,
		success: function(data ){
				var tableRows=CSV.parse(data);
				for(var i in tableRows ){
					var row=tableRows[i];
					if (i > 0) {
						document.getElementById("ingestionTable").innerHTML+=
							"<tr id="+i+">" +
								"<td style=\"vertical-align: middle;\">"+row[0]+"</td>" +
								"<td style=\"vertical-align: middle;\">"+row[1]+"</td>" +
								"<td style=\"vertical-align: middle;\">"+row[2]+"</td>" +
								"<td style=\"vertical-align: middle;\">"+row[3]+"</td>" +
								"<td style=\"vertical-align: middle;\">"+row[4]+"</td>" +
								"<td style=\"vertical-align: middle;\">"+row[5]+"</td>" +
								"<td style=\"vertical-align: middle;\">" +
									"<a href='"+endPoint+"/activity/"+row[0]+"' target='_blank'><button class=\"btn btn-default glyphicon glyphicon-link\"><b></b></button></a>"//ingestion report link
								"</td>" +
							"</tr>";
						//assign color to this row if status is 
						// var classRow = document.getElementById(i);
						// if (row[2] == "completed") {
							// classRow.className += "success";
						// }
					}
				}
			},
		error: function (xhr, ajaxOptions, thrownError) {
			alert("Error loading activities " + xhr.status + " " + thrownError);
			
		}
	});
	
	$("#formIngestion").submit(function (event) {
		event.preventDefault();
		submitPressed();
	})

};

//sent a new injestion to the endpoint
var submitPressed = function() {
	var selectedValue =$('#plan').find(":selected").text();
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var endPoint = document.getElementById("ekbEndpoint").value;
    //endPoint="http://127.0.0.1";//for tests
	
    //build an http post to send the selected plan to the endpoint
	$.ajax({
		url : endPoint+'/activites',
		type: "POST",
		data : {"plan": selectedValue},
		cache:false,
		headers: {
			Authorization: 'Basic ' + btoa(userName + ':' + passWord),
		},

		success: function(data, textStatus, jqXHR)
		{	location.reload(true);	},

		error: function (jqXHR, textStatus, errorThrown)
		{	alert("error submitting activity: "+jqXHR.status +" "+ errorThrown);}
	});

}

//function called when refresh button in the table header is pressed
var refreshTable = function() {
	location.reload(true);
}

