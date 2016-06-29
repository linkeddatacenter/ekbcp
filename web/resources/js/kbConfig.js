
var resetParams=function () {
    writeCookie();
    location.reload(true);
};

var onCreate=function () {
    getInputText();
    $("#formConfig").submit(function (event) {
        event.preventDefault();
        submitPost();
    })
};

var getInputText = function () {
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var ekbEndPoint = document.getElementById("ekbEndpoint").value;

    var editor = document.getElementById("configEditor");

    $.ajax({
        type: 'GET',
        url: ekbEndPoint,
        headers: {
            Accept: "text/turtle",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        success: function (data) {
            editor.value = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error loading kb queries : " + xhr.status + " " + thrownError);
        }
    });
}



var submitPost = function () {
    var userName = document.getElementById("ekbUser").value;
    var passWord = document.getElementById("ekbPassword").value;
    var ekbEndPoint = document.getElementById("ekbEndpoint").value;
    var editor = document.getElementById("configEditor");
    
    $.ajax({
        type: 'PUT',
        url: ekbEndPoint,
        headers: {
            'Content-Type': "turtle",
            Authorization: 'Basic ' + btoa(userName + ":" + passWord)
        },
        data: editor.value,
        success: function (data, textStatus, xhr) {
            displaySuccess(data, textStatus, xhr);
            location.reload(true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            displayError(xhr, ajaxOptions, thrownError);
        }
    });
}

var displaySuccess = function(data, textStatus, xhr){
    if(document.getElementById("confLabel") == null) {
        var div = document.getElementById("editor");

        var okLabel = document.createElement("span");
        okLabel.setAttribute("id", "confLabel");
        okLabel.setAttribute("class", "label label-success");

        okLabel.innerHTML=(xhr.status);
        div.appendChild(okLabel);
    } else {
        if(document.getElementById("confErrMsg") != null){
            var msg = document.getElementById("confErrMsg");
            msg.parentNode.removeChild(msg);
        }
        var label = document.getElementById("confLabel");
        label.parentNode.removeChild(label);
        displaySuccess(data, textStatus, xhr);
    }
}

var displayError = function(xhr, ajaxOptions, thrownError) {
    if(document.getElementById("confErrMsg") == null) {
        if(document.getElementById("confLabel") != null){
            var lb = document.getElementById("confLabel");
            lb.parentNode.removeChild(lb);
        }

        var div = document.getElementById("editor");

        var errorLabel = document.createElement("span");
        errorLabel.setAttribute("id", "confLabel");
        errorLabel.setAttribute("class", "label label-danger");

        var errorMsg = document.createElement("pre");
        errorMsg.setAttribute("id", "confErrMsg");
        errorMsg.setAttribute("class", "configError");

        errorLabel.innerHTML = (xhr.status + ": " + thrownError);
        errorMsg.innerHTML = ("Error message: " + xhr.responseText);

        div.appendChild(errorLabel);
        div.appendChild(errorMsg);
    } else {
        var label = document.getElementById("confLabel");
        var msg = document.getElementById("confErrMsg");
        label.parentNode.removeChild(label);
        msg.parentNode.removeChild(msg);
        displayError(xhr, ajaxOptions, thrownError);
    }
}