// This way JS wont break on Internet Explorer when log statements
// are still in the code.
if (!console.log) {
  console = {log:function(){}};
};
var analyticsId = 'UA-51130014-1';

var setDefaultParams=function(){
  document.getElementById("actualEndpoint").value=sparql.endpoint;
  document.getElementById("ekbUser").value=sparql.user;
  document.getElementById("ekbPassword").value=sparql.paswd;
};

var sparql = {
  endpoint:"https://hub1.linkeddata.center/demo/sparql",
  user:"demo",
  paswd:"demo",
  graphs: {
//    main: "http://lodlaundromat.org#" + llVersion,
//    seedlist: "http://lodlaundromat.org#seedlist",
//    metrics: "http://lodlaundromat.org#metrics-" + llVersion,
//    error: "http://lodlaundromat.org/ontology#error",
//    http: "http://lodlaundromat.org/ontology#http"
  }
};

// Init loader.
$.ajaxSetup({
  beforeSend: function() {
    $('#loader').show();
  },
  complete: function(){
    $('#loader').hide();
    if (goToHash) goToHash();
  },
  success: function() {},
  url : sparql.url,
});

/**
 * helpers
 */
if (typeof d3 != 'undefined') {
  var formatPercentage = d3.format("%");
  var formatThousands = d3.format(",g");
  var formatLargeShortForm = d3.format(".2s");
  var formatNumber = d3.format(",n");
}

$(document).ready(function(){});

var modalDiv = $("<div class='modal  fade'  tabindex='-1' role='dialog' aria-hidden='true'></div>")
    .html('<div class="modal-dialog modal-lg ">' +
        '  <div class="modal-content">' +
        '    <div class="modal-header">' +
        '    </div>' +
        '    <div class="modal-body">' +
        '      <p>One fine body&hellip;</p>' +
        '    </div>' +
        '    <div class="modal-footer"></div>' +
        '  </div><!-- /.modal-content -->' +
        '</div><!-- /.modal-dialog -->')
    .appendTo($("body"));
var modal = modalDiv.modal({show: false});

//draw button config
var drawConfig=function () {
  var drawMenu=function(config){
    //create div contains the params
    var div=$("<div></div>").attr({
      class:"collapse",
      id:"params",
      "aria-expanded":"true",
      style:"height:1px"
    }).appendTo(container); //insert into div container
    document.getElementById("params").innerHTML+="" +
        "\<form class=\"navbar-form navbar-right\" role=\"search\"\>" +
        "<div class=\"form-group\">" +
        "<input type=\"text\" class=\"form-control\" placeholder=\"Endpoint\" id = \"actualEndpoint\">" +
        "<input type=\"text\" class=\"form-control\" placeholder=\"User\" id = \"ekbUser\">" +
        "<input type=\"password\" class=\"form-control\" placeholder=\"Password\" id = \"ekbPassword\">" +
        "</div><button type=\"button\" class=\"btn btn-default\" onclick=\"resetParams()\"\">Set Credential</button> </form>"
    var item = $("<ul></ul>").attr({
      class:config.classUL
    }).appendTo("#nav"); //insert into div nav
    var elem = $("<li></li>").appendTo(item);
    if (config.active) item.addClass(config.class);
    var anchor = $("<a></a>").appendTo(elem);
    if (config.newWindow) anchor.attr("target", "_blank");
//    $("<img/>").attr("src", config.img).appendTo(anchor);
    var button=$("<button></button>").appendTo(anchor);
    button.attr({
      "class":config.classButton,
      "data-toggle":"collapse",
      "data-target":"#params",
      "aria-expanded":"false"
    });
    var span=$("<span></span>").attr("aria-hidden","true").appendTo(button);
    span.addClass("glyphicon glyphicon-cog");
  };
  var item= {classUL: "nav navbar-nav navbar-right", id: "menu", class:"active",  title: "MyAccount  ",classButton:"btn btn-sm btn-default"};
  drawMenu(item);
};

/**
 * draw header
 */
var drawHeader = function() {
  var addItem = function(config) {
    var item = $("<li></li>").appendTo(topNavBar);
    if (config.active) item.addClass("active");
    var anchor = $("<a></a>").attr("href", config.href).appendTo(item);
    if (config.newWindow) anchor.attr("target", "_blank");
    // $("<img/>").attr("src", config.img).appendTo(anchor);
    $("<span></span>").text(config.title).appendTo(anchor);
  };
  var items = [
    {href: "/ingestion",  title: "New Ingestion"},
    {href: "/status", title: "Status"},
    {href: "/history", title: "History"},
    {href: "/sparql",  title: "SPARQL"},
    {href: "/services", img: "/imgs/labels.png", title: "Queries"},
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
    basename = basename.substring(0, hashTagIndex-1);
  }

  if (basename.length == 0) basename = "index.html";

  for (var i = 0; i < items.length; i++) {
    if (basename == items[i].href) items[i].active = true;
    addItem(items[i]);
  }
};
drawHeader();
drawConfig();
setDefaultParams();