$(document).ready(function() {	
    userName = document.getElementById("ekbUser").value;
    passWord = document.getElementById("ekbPassword").value;
    endPoint = document.getElementById("actualEndpoint").value;
	
	// if (endPoint == "https://hub1.linkeddata.center/demo") {
		// endPoint += "/sparql";
	// }
});

// Init loader.
// $.ajaxSetup({
  // beforeSend: function() {
    // $('#loader').show();
  // },
  // complete: function(){
    // $('#loader').hide();
    // if (goToHash) goToHash();
  // },
  // success: function() {},
  // url : sparql.url,
// });

var submitPressed = function() {
	var selectedValue = document.getElementById("plan").value;
	var selectedItem = document.getElementById("plan");
	var selectedText = selectedItem.options[selectedItem.selectedIndex].text;
	//research the value
	if (selectedValue == "b") {
		console.log("booting");
		addRow(selectedText);
	} else if (selectedValue == "r") {
		console.log("reasoning");
		addRow(selectedText);
	} else if (selectedValue == "lr") {
		console.log("learning+reasoning");
		addRow(selectedText);
	} else if (selectedValue == "blr") {
		console.log("booting+learning+reasoning");
		addRow(selectedText);
	} else if (selectedValue == "null") {
		
	}
	/*it may not work correctly*/
	//Create a query POST to server which has header include
	//authorization, accept and content-type.
	//The commented rows are some try to make it work
	$.ajax({
		// beforeSend: function (xhr) {
			// xhr.setRequestHeader ("Authorization", "Basic " + btoa(userName + ":" + passWord));
		// },
		url: endPoint + '/activites',
		type: 'POST',
		data: selectedValue,
		headers: {
			Authorization: 'Basic ' + btoa(userName + ":" + passWord),
			Accept : "text/csv; charset=utf-8",
			"Content-Type": "text/plain; charset=utf-8"
		},
		crossDomain: true,
		// headers: {
			// Authorization: 'Basic ' + btoa(userName + ":" + passWord),
			// 'Content-Type': 'text/csv',
			// Accept: 'text/csv'
		// },
		// contentType: "text/plain; charset=utf-8",
		// dataType: 'text',
		// username: userName,
		// password: passWord,
		success: function (data, status) {
			console.info(data);
		}
	});
}

var refreshTable = function() {
	location.reload(true);
}

var resetParams = function() {
	writeCookie();
	location.reload(true);
}

// function deleteRow(obj) {     
    // var index = obj.parentNode.parentNode.rowIndex;
    // var table = document.getElementById("ingestionTable");
    // table.deleteRow(index);   
// }

function addRow(plan) {
    var table = document.getElementById("ingestionTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
		
	var pageButton = document.createElement("button");
	pageButton.setAttribute("type", "button");
	pageButton.setAttribute("class", "btn btn-info");
	//insert the URL of the page
	pageButton.setAttribute("onClick", "openNewPage(\"http://www.w3schools.com\")");
	//create a new image which will append to the button
    var img = document.createElement('img');
    img.src = "resources/images/infoIcon.png";
    pageButton.appendChild(img);

    row.insertCell(0).innerHTML = "myID";
    row.insertCell(1).innerHTML = plan;
    row.insertCell(2).innerHTML = timeStamp();
    row.insertCell(3).innerHTML = timeStamp();
    row.insertCell(4).innerHTML = Date();
	//give a name to the last cell
	//and assign it the button
    var buttonCell = row.insertCell(5);
	buttonCell.appendChild(pageButton);
}

function openNewPage(page) {
	window.open(page);
}

function timeStamp() {
	// Create a date object with the current time
	var now = new Date();
	// Create an array with the current month, day and time
	var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
	// Create an array with the current hour, minute and second
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
	
	/* eliminate the block of comment to see the houre with AM/PM suffix
	// Determine AM or PM suffix based on the hour
	var suffix = ( time[0] < 12 ) ? "AM" : "PM";
	// Convert hour from military time
	time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
	*/
 
	// If hour is 0, set it to 12
	time[0] = time[0] || 12;
	// If seconds and minutes are less than 10, add a zero
	for ( var i = 1; i < 3; i++ ) {
		if ( time[i] < 10 ) {
		time[i] = "0" + time[i];
		}
	}
	// Return the formatted string
	return date.join("/") + " " + time.join(":") + " " /* + suffix */;
}