
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Download icons test (WebSocket vs HTTP)' })
};

