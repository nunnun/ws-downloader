var num = 150;
window.URL = window.URL || window.webkitURL;
window.WebSocket = window.WebSocket || window.MozWebSocket;

$("#num").text(num);

var ws = new WebSocket("ws://"+location.host)
ws.onopen = function(){
  $("button.http").fadeIn();
  $("button.websocket").fadeIn();
}

$("button.http").click(function(){
  withHTTP();
}).hide();
$("button.websocket").click(function(){
  withWebSocket();
}).hide();
// websocket
// ----------------------------
var withWebSocket = function(){
  var count = 0
    , out = $('output.websocket')
    , st
    , res

  out.empty();
  $(".res_websocket").empty();

  for(var i = 0; i < num; i += 1){
    ws.send("get");
  }

  ws.onmessage = function(e) {
    var blob = e.data;

    var url = window.URL.createObjectURL(blob);
    out.append("<img src='"+url+"'>");

    st = (count === 0 ? new Date().getTime() : st);
    count += 1;

    if(count === num) {
      $(".res_websocket").text(new Date().getTime() - st);
    }
  }
};

// http
// -------------------------------
var withHTTP = function(){
  var out = $('output.http')
    , st
    , res
    , count = 0;

  var getImg = function(id){
    out.append("<img id='httptest"+id+"'src='/logo/"+id+"?"+new Date().getTime()+"'>");


    $("#httptest"+id).bind("load", function(){
      count += 1;
      if(count === num) {
        $(".res_http").text(new Date().getTime() - st);
      }
    });
  }

  var start = function(){
    out.empty();
    $(".res_http").empty();

    st = new Date().getTime();
    for(var i = 0; i < num; i += 1){
      getImg(i);
    };
  }
  start();
};
