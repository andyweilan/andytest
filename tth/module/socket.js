var io = require('socket.io')();

var StocksSZ = require('./StocksSZ');
var StocksSH = require('./StocksSH');

var RealTimeMananger = require('./RealTimeManager');

var RTMan = new RealTimeMananger();


var stockController = require('../controllers/stock-controller.js');




io.sockets.on('connection', function(socket) {

	socket.emit('hello');

	var clientIp = socket.request.connection.remoteAddress;

	console.log('New connection from ' + clientIp);

	//start_stock
	socket.on('start_stock', function(username) {

		console.log('uname:' + username);

		stockController.findFavoriteStocks(username, function(err, doc) {

			if (err) {

				console.log("error while findFavoriteStocks");
			} else if (doc) {

				console.log("favor stocks:" + doc.stocks.length);
				for (var i = 0; i < doc.stocks.length; i++) {

				}
			}

		});

	});


	//get_stocklist
	socket.on('get_stocklist', function(username) {

		console.log("get list");

		stockController.delAllStocks();

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

	//add_stock
	socket.on('add_stock', function(stockcode, username) {

		stockController.findStock(stockcode, function(err, stock) {

			if (stock) {

				console.log("found st");

				stockController.addFavoriteStock(username, stock.code, stock.ex, function(err, doc) {

					if (doc) {
						console.log("success to add:" + stock.code);
					}

				});

				//if (realTimeArray[realtimeKey]) {

				//	realTimeArray[realtimeKey].addStock(doc.ex + stockcode);
				//}


			} else {

				socket.emit('err_message', "添加失败，不是有效的股票代码！");

			}

		});

	});


});



exports.listen = function(_server) {
	return io.listen(_server);
};