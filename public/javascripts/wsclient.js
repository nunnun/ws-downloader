var num = 150;
window.URL = window.URL || window.webkitURL;
window.WebSocket = window.WebSocket || window.MozWebSocket;

$("#num").text(num);

var http_sleep = 1000;

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
	var send_result = $("#send_result")[0].checked;
	var measure_times = $('#measure_times option:selected').text();
	var measure_counter = 0;
	var results = [];

	var fetch = function() {
		var count = 0, out = $('output.websocket'), st, res

		out.empty();
		$(".res_websocket").empty();

		for ( var i = 0; i < num; i += 1) {
			ws.send("get");
		}

		ws.onmessage = function(e) {
			var blob = e.data;

			var url = window.URL.createObjectURL(blob);
			out.append("<img src='" + url + "'>");

			st = (count === 0 ? new Date().getTime() : st);
			count += 1;

			if (count === num) {
				var loadtime = new Date().getTime() - st;
				if (send_result) {
					postResult('ws', loadtime, function() {
						measure_counter++;
						if (measure_counter < measure_times) {
							results.push(loadtime);
							fetch();
						}else{
							results.push(loadtime);
							$(".res_websocket").text(results.join());
						}
					});
				}else{
					measure_counter++;
					if (measure_counter < measure_times) {
						results.push(loadtime);
						fetch();
					}else{
						results.push(loadtime);
						$(".res_websocket").text(results.join());
					}
				}
				
			}
		}
	}
	fetch();
};

// http
// -------------------------------
var withHTTP = function(){
	var send_result = $("#send_result")[0].checked;
	var measure_times = $('#measure_times option:selected').text();
	var measure_counter = 0;
	var results = [];
	var fetch = function() {

		var out = $('output.http'), st, res, count = 0;

		var getImg = function(id) {
			out.append("<img id='httptest" + id + "'src='/logo/" + id + "?"
					+ new Date().getTime() + "'>");

			$("#httptest" + id).bind("load", function() {
				count += 1;
				if (count === num) {
					var loadtime = new Date().getTime() - st;
					if (send_result) {
						postResult('http', loadtime, function() {
							measure_counter++;
							if (measure_counter < measure_times) {
								results.push(loadtime);
								setTimeout(fetch,http_sleep);
							}else{
								results.push(loadtime);
								$(".res_http").text(results.join());
							}
						});
					}else{
						measure_counter++;
						if (measure_counter < measure_times) {
							results.push(loadtime);
							setTimeout(fetch,http_sleep);
						}else{
							results.push(loadtime);
							$(".res_http").text(results.join());
						}
					}
					
				}
			});
		};

		var start = function() {
			out.empty();
			$(".res_http").empty();

			st = new Date().getTime();
			for ( var i = 0; i < num; i += 1) {
				getImg(i);
			}

		};
		start();
	};

	fetch();
};


var postResult = function(method,time,callback){
	$.ajax({
		type: 'POST',
		url: '/result',
		data: {
			'method':method,
			'time':time
		},
		success: callback
	});
}
