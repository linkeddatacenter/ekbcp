// This way JS wont break on Internet Explorer when log statements
// are still in the code.
if (!console.log) {
  console = {log:function(){}};
};
var analyticsId = 'UA-51130014-1';
var prefixes = "PREFIX llo: <http://lodlaundromat.org/ontology/>\n\
PREFIX ll: <http://lodlaundromat.org/resource/>\n";
var llVersion = 12;
var queryDefaultValues={
	endpoint:"https://hub1.linkeddata.center/demo/sparql",
	user:"demo",
	password:"demo",
}

var sparql = {
	url : "http://sparql.backend.lodlaundromat.org",
	graphs: {
		main: "http://lodlaundromat.org#" + llVersion,
		seedlist: "http://lodlaundromat.org#seedlist",
		metrics: "http://lodlaundromat.org#metrics-" + llVersion,
		error: "http://lodlaundromat.org/ontology#error",
		http: "http://lodlaundromat.org/ontology#http"
	},
	prefixes: prefixes,
	};

var api = {
  "laundryBasket": {
    "seedUpdateApi": "http://backend.lodlaundromat.org"
  },
  "notifications": {
      "api": "http://notify.lodlaundromat.d2s.labs.vu.nl"
  },
  "ldf": {
      browser: "http://ldf.lodlaundromat.org/",
      query: function(md5) {
          var ldfUrl = api.ldf.browser + md5;
          return "http://client.linkeddatafragments.org/#startFragment=" + encodeURIComponent(ldfUrl);
      },
  },

  "namespace": "http://lodlaundromat.org/vocab#",
  "wardrobe": {
    "download": function(md5, type) {
      var url = "http://download.lodlaundromat.org/" + md5;
      if (type) url += "?type=" + type;
      return url;
    }
  }
};


var getSparqlLink = function(query) {
  return "/sparql?query=" + encodeURIComponent(query);
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

$("<div id='loader'><img src='/imgs/loader.gif'></div>").appendTo($("body"));



/**
 * helpers
 */
if (typeof d3 != 'undefined') {
  var formatPercentage = d3.format("%");
  var formatThousands = d3.format(",g");
  var formatLargeShortForm = d3.format(".2s");
  var formatNumber = d3.format(",n");
}
var goToHash = function(){
  if(window.location.hash) {
    $.scrollTo($(window.location.hash), { duration: 500 });
  }
};

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
 * config {
 *  header: null, string, or jquery el
 *  content: string (text) or jquery el
 *  footer: null, string(html), or jquery el
 * }
 */
var drawModal = function(config) {
  var header = modalDiv.find(".modal-header");
  if (!config.header) {
    if (header.length > 0) modalDiv.find(".modal-header").remove();
  } else {
    if (header.length == 0) header = $("<div class='modal-header'></div>").prependTo(modalDiv.find(".modal-content"));
    if (typeof config.header == "string") {
      modalDiv.find(".modal-header").html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">' + config.header + '</h4>');
    } else {
      modalDiv.find(".modal-header").empty().append(config.header);
    }
  }
  modalDiv.find(".modal-body").empty().append(config.content);
  modal.modal("show");
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
//    $("<img/>").attr("src", config.img).appendTo(anchor);
    $("<span></span>").text(config.title).appendTo(anchor);
  };
  var items = [
    {href: "/pagina", img: "/imgs/laundry.png", title: "Config"},
    {href: "/basket", img: "/imgs/basket.png", title: "New Ingestion"},
    {href: "/wardrobe", img: "/imgs/wardrobe.png", title: "Status"},
    {href: "/lodlab", title: "History"},
    {href: "/sparql", img: "/imgs/labels.png", title: "SPARQL"},
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


//this function is useful for printing charts to pdf.
var deleteEveryDivExcept = function(divId) {
  $("div").hide();
  $("h1").hide();
  $("h2").hide();
  $("h3").hide();
  var targetDiv = $("#" + divId);
  targetDiv.parents().show();
  targetDiv.show();
};


var showNotification = function(msg) {
    if (msg) {
        $('<div>', {class: 'alert alert-info', role: 'alert'}).text(msg).prependTo($('body'));
    }
}
//showNotification('We have upgraded the Washing Machine crawling mechanism. For consistency reasons, we have re-initiated the crawl from scratch. (taking the manually added seed-items from the previous crawl into account) (20 Feb. 2015)');

var setCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
