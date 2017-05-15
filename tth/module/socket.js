var io = require('socket.io')();

var StocksSZ = require('./StocksSZ');
var StocksSH = require('./StocksSH');


io.sockets.on('connection', function(socket) {

	socket.emit('hello');

	var clientIp = socket.request.connection.remoteAddress;

	console.log('New connection from ' + clientIp);


	socket.on('start_stock', function(username) {

		console.log('uname:' + username);

		global.OPER.findFavoriteStocks(username, function(err, doc) {

			if (err) {
				//res.sendStatus(500);
			} else if (doc) {

				console.log("favor stocks:" + doc.stocks.length);
				for (var i = 0; i < doc.stocks.length; i++) {

				}
			}

		});

	});



	socket.on('get_stocklist', function(username) {

			console.log("get list");

			global.OPER.delAllStocks();

			//sz stocks
			var stSZ = new StocksSZ();

			stSZ.start(function(ret) {

				//console.log("message to front end");

				if (ret == 0) {
					socket.emit('err_message', '获取深圳股票成功了!');
				} else {
					socket.emit('err_message', '获取深圳股票出错了!');

				}

			});

			///*
			var stSH = new StocksSH();
			stSH.start(function(ret) {
			  //console.log('message to front end');

			  if (ret == 0) {
			    socket.emit('err_message', '获取上证股票成功了!');
			  } else {
			    socket.emit('err_message', '获取上证股票出错了!');

			  }

			});
			//*/

	});


});



exports.listen = function(_server) {
	return io.listen(_server);
};