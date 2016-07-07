// This way JS wont break on Internet Explorer when log statements
// are still in the code.
if (!console.log) {
  console = {log:function(){}};
};
var analyticsId = 'UA-68082875-1';
var defaultEndpoint = 'http://pub.linkeddata.center/demo';
var defaultUser = 'demo';
var defaultPassword = 'demo';

$(document).ready(function () {
    drawHeader();
    drawConfig();
    drawFooter();
    setDefaultParams();
    onCreate();
});
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


//draw button config
var drawConfig = function () {
    var item = $("<ul></ul>").attr({
        class: "nav navbar-nav navbar-right"
    }).appendTo("#nav"); //insert into div nav
    var elem = $("<li></li>").attr({"id":"cont"}).appendTo(item);
    var anchor = $("<a></a>").attr({
        "href":"#",
        "class":"dropdown-toggle",
        "data-toggle":"dropdown",
        "aria-expanded":"true"
    }).appendTo(elem);
    var button = $("<button></button>").appendTo(anchor);
    button.addClass("btn btn-default");
    button.attr({
        "data-toggle": "collapse",
        "data-target": "#params"
    });
    var span = $("<span></span>").appendTo(button);
    span.addClass("glyphicon glyphicon-cog");
    //TODO translate to jquery
    var s="";

    s += "<ul id=\"panel\" class='dropdown-menu' role='menu'>";
    
    s += "				<li>";
    s += "                          <a href='#collapse'data-toggle='collapse'><span>Set Credential...</span></a>";
    s += "							<div class=\"panel-collapse collapse\" id='collapse'>";
    s += "					 <div class=\"col-md-12\">"+
                                        "<div style='height: 10px'><\/div>"+
                                        "<div class=\"form-group\">" +
                                        "<div class=\"input-group\">" +
                                        "<span class=\"input-group-addon\" style='min-width: 100px'>Endpoint</span>" +
                                        "<input type=\"text\" class=\"form-control\" id=\"ekbEndpoint\">" +
                                        "</div>" + "<div style='height: 14px'><\/div>"+
                                        "<div class=\"input-group\">" +
                                        "<span class=\"input-group-addon\" style='min-width: 100px'>Username</span>" +
                                        "<input type=\"text\" class=\"form-control\" id=\"ekbUser\">" +
                                        "</div>" +"<div style='height: 14px'><\/div>"+
                                        "<div class=\"input-group\">" +
                                        "<span class=\"input-group-addon\" style='min-width: 100px'>Password</span>" +
                                        "<input type=\"password\" class=\"form-control\" id=\"ekbPassword\">";
    s += "							<\/div>"+ "<div style='height: 10px'><\/div>";
    s +=                             "<button type=\"button\" class=\"btn btn-default\" onclick=\"resetParams()\">Ok</button>";
    s += "					 <\/div>";
    s += "				<\/li>";
    
    s += "				<li>";
    s += "                          <a href='kbConfig.html'><span >Knowledge Base configuration...</span></a>";
    s += "				<\/li>";
   /* 
    s += "				<li>";
    s += "                          <a><span>Change Password</span></a>";
    s += "				<\/li>";

    
    s += "				<li>";
    s += "                          <a><span>Clear cache</span></a>";
    s += "				<\/li>";
    s += "				<li>";
    s += "                          <a><span>Delete All</span></a>";
    s += "				<\/li>";
    s += "				<li>";
    s += "                          <a><span>Purge Activities</span></a>";
    s += "				<\/li>";
   */
    s += "			<\/ul>";
    var spanSetCredential=$("<span></span>").text("Set credential...").appendTo("");
    document.getElementById("cont").innerHTML+=s;
    $('ul.dropdown-menu').on('click', function(event){
        var events = $._data(document, 'events') || {};
        events = events.click || [];
        for(var i = 0; i < events.length; i++) {
            if(events[i].selector) {

                //Check if the clicked element matches the event selector
                if($(event.target).is(events[i].selector)) {
                    events[i].handler.call(event.target, event);
                }

                // Check if any of the clicked element parents matches the
                // delegated event selector (Emulating propagation)
                $(event.target).parents(events[i].selector).each(function(){
                    events[i].handler.call(this, event);
                });
            }
        }
        event.stopPropagation();
    });
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
