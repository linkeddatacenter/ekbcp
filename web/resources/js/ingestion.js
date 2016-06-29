//function called when pressed set credential
var resetParams = function() {
	writeCookie();
	location.reload(true);
}

var config = {
	delimiter: "",	// auto-detect
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
	skipEmptyLines: false,
	chunk: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined
}

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
		success: function(data){
			var tableRows=Papa.parse(data, config);
			var dati = tableRows.data; // contiene 3 array
			for(var j = 1; j < dati.length -1; ++j){
				var row = dati[j];
				document.getElementById("ingestionTable").innerHTML+=
					"<tr id=\"+j+\">" +
					"<td style=\"vertical-align: middle\">"+row[0]+"</td>" +
					"<td style=\"vertical-align: middle\">"+row[1]+"</td>" +
					"<td style=\"vertical-align: middle\">"+row[2]+"</td>" +
					"<td style=\"vertical-align: middle\">"+row[3]+"</td>" +
					"<td style=\"vertical-align: middle\">"+row[4]+"</td>" +
					"<td style=\"vertical-align: middle\">"+row[5]+"</td>" +
					"<td style=\"vertical-align: middle\">" +
					"<a href='"+endPoint+"/activity/"+row[0]+"' target='_blank'><button class=\"glyphicon glyphicon-italic\"><b></b></button></a>"//ingestion report link
				"</td>" +
				"</tr>";
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alert("Error loading activities " + xhr.status + " " + thrownError + xhr.responseText);

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
		url : endPoint+'/activities',
		type: "POST",
		data : "plan="+ encodeURIComponent(selectedValue),
		headers: {
			Authorization: 'Basic ' + btoa(userName + ':' + passWord),
			'Content-type': 'application/x-www-form-urlencoded'
		},
		cache: false,
		success: function(data, textStatus, jqXHR)
		{	location.reload(true);	},

		error: function (jqXHR, textStatus, errorThrown)
		{	alert("error submitting activity: "+jqXHR.status +" "+ errorThrown + xhr.responseText);}
	});

}

//function called when refresh button in the table header is pressed
var refreshTable = function() {
	location.reload(true);
}

