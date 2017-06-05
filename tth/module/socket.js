var io = require('socket.io')();

var StocksSZ = require('./StocksSZ');
var StocksSH = require('./StocksSH');

var RealTimeData = require('./RealTime');

var sleep = require('sleep');



var stockController = require('../controllers/stock-controller.js');


var getStockList = function(stocks) {

	var stList = "";

	for (var i = 0; i < stocks.length; i++) {
		if (stList) {
			stList += ',';
		}

		stList += stocks[i].ex + stocks[i].stockcode;

	}

	return stList;

};

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

				if (doc.stocks.length > 0) {

					var stList = getStockList(doc.stocks);

					socket.emit('favor_stock_list', stList);

					var realtimedata = new RealTimeData(stList);

					realtimedata.pollingLoop(socket);


				}

			}

		});

	});

	socket.on('stock_real_time', function(stList) {

		sleep.sleep(2);

		var realtimedata = new RealTimeData(stList);

		realtimedata.pollingLoop(socket);


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

						socket.emit('favor_stock_list', stock.ex + stock.code);
					}

				});


			} else {

				socket.emit('err_message', "添加失败，不是有效的股票代码！");

			}

		});

	});

	socket.on('disconnect', function() {


		console.log('disconnect');

	});


});



exports.listen = function(_server) {
	return io.listen(_server);
};