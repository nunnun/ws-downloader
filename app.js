/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , WebSocketServer = require('websocket').server
  , fs = require('fs')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/logo/:id', function(req, res){
  fs.readFile(__dirname + '/public/images/html5-32.png', function(e, data) {
    res.header("Content-Type", "image/png");
    res.header("Connection", "close");
    res.send(data);
    res.end();
  });
});


// WebSocket

var wsServer = new WebSocketServer({
  httpServer: app,
  autoAcceptConnections: false
});

function checkOrigin(origin){
  // TODO check origin is valid or not
  return true;
}

wsServer.on('request', function(req) {
  if (!checkOrigin(req.origin)) {
    req.reject();
    console.log(req.origin+" is rejected");
    return;
  }

  var conn = req.accept('', req.origin);

  conn.on('message', function(mesg) {
    fs.readFile(__dirname + '/public/images/html5-32.png', function(e, data) {
      conn.sendBytes(data);
    });
  });
  conn.on('close', function(){});
});

app.listen(process.env.VMC_APP_PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
