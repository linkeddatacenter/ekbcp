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
					document.getElementById("ingestionTable").innerHTML+=
                        "<tr>" +
                            "<td>"+row[0]+"</td>" +
                            "<td>"+row[1]+"</td>" +
                            "<td>"+row[2]+"</td>" +
                            "<td>"+row[3]+"</td>" +
                            "<td>"+row[4]+"</td>" +
                            "<td>"+row[5]+"</td>" +
                            "<td>" +
                                "<a href='"+endPoint+"/activity/"+row[0]+"' target='_blank'><button class=\"glyphicon glyphicon-italic\"><b></b></button></a>"//ingestion report link
                            "</td>" +
                        "</tr>";
						//decide to use the I or the Link symbol (glyphicon glyphicon-link)
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

