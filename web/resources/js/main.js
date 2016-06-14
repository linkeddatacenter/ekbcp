// This way JS wont break on Internet Explorer when log statements
// are still in the code.
if (!console.log) {
  console = {log:function(){}};
};
var analyticsId = 'UA-51130014-1';
var llVersion = 12;
var queryDefaultValues={
  endpoint:"http://linkeddata.center/test.php",
  user:"demo",
  paswd:"demo",
}
var setDefaultParams=function(){
  var uriField=document.getElementById("actualEndpoint").value=queryDefaultValues.endpoint;
  var userField=document.getElementById("ekbUser").value=queryDefaultValues.user;
  var passField=document.getElementById("ekbPassword").value=queryDefaultValues.paswd;
};
setDefaultParams();
var sparql = {
  graphs: {
    main: "http://lodlaundromat.org#" + llVersion,
    seedlist: "http://lodlaundromat.org#seedlist",
    metrics: "http://lodlaundromat.org#metrics-" + llVersion,
    error: "http://lodlaundromat.org/ontology#error",
    http: "http://lodlaundromat.org/ontology#http"
  },
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



/**
 * draw header
 */
var drawHeader = function() {
  var addItem = function(config) {
    var item = $("<li></li>").appendTo(topNavBar);
    if (config.active) item.addClass("active");
    var anchor = $("<a></a>").attr("href", config.href).appendTo(item);
    if (config.newWindow) anchor.attr("target", "_blank");
//    $("<img/>").attr("src", config.img).appendTo(anchor);
    $("<span></span>").text(config.title).appendTo(anchor);
  };
  var items = [
    {href: "/pagina",  title: "Config"},
    {href: "/basket",  title: "New Ingestion"},
    {href: "/wardrobe", title: "Status"},
    {href: "/lodlab", title: "History"},
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

var getAndDrawCounter = function() {
  var draw = function(count) {
    var holder = $('.counter');
    var countString = count.toString();
    var charsLeft = countString.length;
    for (var i = 0; i < countString.length; i++) {
//    <span class="position"><span class="digit static" style="top: 0px; opacity: 1;">0</span></span>
      holder.append($('<span>' + countString.charAt(i) + '</span>'));
      charsLeft = charsLeft - 1;
      if (charsLeft % 3 == 0 && charsLeft > 0) {
        holder.append("<span>.</span>");
      }
    }
  };
  if ($('.counter').length > 0) {
    $.ajax({
      url: sparql.url,
      data: [
        {name: "default-graph-uri", value: sparql.graphs.main},
        {name: "query", value: sparql.queries.totalTripleCount}
      ],
      success: function(data) {
        if (data.results && data.results.bindings && data.results.bindings.length > 0 && data.results.bindings[0].totalTriples && data.results.bindings[0].totalTriples.value > 0) {
          draw(data.results.bindings[0].totalTriples.value);
        } else {
          $("#counterWrapper").hide();
        }
      },
      headers: {
        "Accept": "application/sparql-results+json,*/*;q=0.9"
      }
    });
  }
};
getAndDrawCounter();




