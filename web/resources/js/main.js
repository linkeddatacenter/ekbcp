// This way JS wont break on Internet Explorer when log statements
// are still in the code.
if (!console.log) {
  console = {log:function(){}};
};
var analyticsId = 'UA-68082875-1';
var defaultEndpoint = 'http://pub.linkeddata.center/demo';
var defaultUser = 'demo';
var defaultPassword = 'demo';


var setDefaultParams=function(){
  var cookie = readCookie();
  var pathArray = window.location.pathname.split('/');
  var currentPage = pathArray[pathArray.length - 1];
  if(cookie != "null"){
      var cookieValues = cookie.split(" "); 
	  document.getElementById("ekbEndpoint").value= atob(cookieValues[0]);
      document.getElementById("ekbUser").value=atob(cookieValues[1]);
      document.getElementById("ekbPassword").value=atob(cookieValues[2]);
  } else {
	  document.getElementById("ekbEndpoint").value=defaultEndpoint;
      document.getElementById("ekbUser").value=defaultUser;
      document.getElementById("ekbPassword").value=defaultPassword;
  }
};

var readCookie = function(){
      var cname = "credentialCookie";
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              var cvalue = ""+c.substring(name.length,c.length);
              return cvalue;
          }
      }
      return "null";
}

var writeCookie = function(){
    userName = btoa(document.getElementById("ekbUser").value);
    passWord = btoa(document.getElementById("ekbPassword").value);
    endPoint = btoa(document.getElementById("ekbEndpoint").value);

    var name = "credentialCookie";
    var value = endPoint+" "+ userName+ " " + passWord;
    var ttl = 14400 * 24 * 60 * 60 * 1000 ; //14400 minute = 1 day
   
    var d = new Date();
    d.setTime(d.getTime() + (ttl));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
};

// helpers
// if (typeof d3 != 'undefined') {
//     var formatPercentage = d3.format("%");
//     var formatThousands = d3.format(",g");
//     var formatLargeShortForm = d3.format(".2s");
//     var formatNumber = d3.format(",n");
// }

$(document).ready(function () {
	drawHeader();
	drawConfig();
	drawFooter();
	setDefaultParams();
    onCreate();
});

// var modalDiv = $("<div class='modal  fade'  tabindex='-1' role='dialog' aria-hidden='true'></div>")
//     .html('<div class="modal-dialog modal-lg ">' +
//         '  <div class="modal-content">' +
//         '    <div class="modal-header">' +
//         '    </div>' +
//         '    <div class="modal-body">' +
//         '      <p>One fine body&hellip;</p>' +
//         '    </div>' +
//         '    <div class="modal-footer"></div>' +
//         '  </div><!-- /.modal-content -->' +
//         '</div><!-- /.modal-dialog -->')
//     .appendTo($("body"));
// var modal = modalDiv.modal({show: false});


//draw button config
var drawConfig = function () {
    //create div contains the params
    var div = $("<div></div>").attr({
        class: "collapse",
        id: "params",
        "aria-expanded": "true",
        style: "height:1px"
    }).appendTo(container); //insert into div container

    document.getElementById("params").innerHTML += "" +
        "\<form class=\"navbar-form navbar-right\" role=\"search\"\>" +
        "<div class=\"form-group\">" +
        "<div class=\"input-group\">" +
        "<span class=\"input-group-addon\">Endpoint</span>" +
        "<input type=\"text\" class=\"form-control\" id=\"ekbEndpoint\">" +
        "</div>" +
        "<div class=\"input-group\">" +
        "<span class=\"input-group-addon\">Username</span>" +
        "<input type=\"text\" class=\"form-control\" id=\"ekbUser\">" +
        "</div>" +
        "<div class=\"input-group\">" +
        "<span class=\"input-group-addon\">Password</span>" +
        "<input type=\"password\" class=\"form-control\" id=\"ekbPassword\">" +
        "</div>" +
        "</div>" +
        "<button type=\"button\" class=\"btn btn-default\" onclick=\"resetParams()\">Set Credential</button>" +
        "</form>";

    var item = $("<ul></ul>").attr({
        class: "nav navbar-nav navbar-right"
    }).appendTo("#nav"); //insert into div nav
    var elem = $("<li></li>").appendTo(item);
    var anchor = $("<a></a>").appendTo(elem);
    var button = $("<button></button>").appendTo(anchor);
    button.addClass("btn btn-default");
    button.attr({
        "data-toggle": "collapse",
        "data-target": "#params",
        "aria-expanded": "false"
    });
    var span = $("<span></span>").attr("aria-hidden", "true").appendTo(button);
    span.addClass("glyphicon glyphicon-cog");
};

//draw header
var drawHeader = function () {
    var addItem = function (config) {
        var item = $("<li></li>").appendTo(topNavBar);
        if (config.active) item.addClass("active");
        var anchor = $("<a></a>").attr("href", config.href).appendTo(item);
        if (config.newWindow) anchor.attr("target", "_blank");
        if (config.href == "http://linkeddata.center") {
            var img = $("<img/>").attr("src", config.img);
            img.addClass("imgHeaderIco");
            img.appendTo(anchor);
        }
        $("<span></span>").text(config.title).appendTo(anchor);
    };
    var items = [
        {href: "http://linkeddata.center", img: "resources/images/linkeddataBrowserIco.png"},
        {href: "index.html", title: "SPARQL"},
        {href: "ingestion.html",title: "Ingestion"},
        {href: "queries.html", title: "Queries"},
    ];
    var lastIndexOf = document.URL.lastIndexOf("/");
    var basename = "";
    if (lastIndexOf < document.URL.length) {
        basename = document.URL.substring(lastIndexOf + 1);
    }
    var hashTagIndex = basename.indexOf("#");
    if (hashTagIndex == 0) {
        basename == "";
    } else if (hashTagIndex > 0) {
        basename = basename.substring(0, hashTagIndex - 1);
    }
    if (basename.length == 0) basename = "index.html";

    for (var i = 0; i < items.length; i++) {
        if (basename == items[i].href) items[i].active = true;
        addItem(items[i]);
    }
  };

//draw footer
var drawFooter = function () {
    var items = [
        {href: "", img: "resources/images/LDC_Subscriptions.png", class: "img-responsive"},
        {href: "/social/linkedin", img: "resources/images/linkedin.png"},
        {href: "/social/facebook", img: "resources/images/facebook.png"},
        {href: "/social/gplus", img: "resources/images/googleplus.png"},
        {href: "/social/twitter", img: "resources/images/twitter.png"},
        {href: "/social/github", img: "resources/images/github.png"}
    ];

    for (var i = 0; i < items.length; ++i) {
        var item;
        (i < 1) ? item = $("<li></li>").appendTo(footer_linkeddata) : item = $("<li></li>").appendTo(footer_social);
        item.addClass("active");

        var anchor = $("<a></a>").attr("href", "http://linkeddata.center" + items[i].href);
        anchor.attr("target", "_blank");
        anchor.appendTo(item);

        var img = $("<img/>").attr("src", items[i].img);
        if (items[i].class)img.addClass(items[i].class);
        img.appendTo(anchor);
    }
}
