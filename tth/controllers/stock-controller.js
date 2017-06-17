var DailyPrices = require('../module/DailyPrices');

module.exports.stocklistlimit = function(req, res) {

	var code = req.body.code;

	console.log('code:' + req.body.code);

	var num = 10;

	global.OPER.findStocksList(code, num, function(err, docs) {

		if (err) {
			console.log("error to find");

			res.sendStatus(500);
		} else if (!docs || !docs[0]) {
			console.log("not found valid");

			res.status(200).send({
				state: 'success',
				list: '',
				msg: 'not found'
			});

		} else {
			console.log(docs[0]);

			res.status(200).send({
				state: 'success',
				list: docs
			});
		}
	});

}

module.exports.findFavoriteStocks = function(username, callback) {

	global.OPER.findFavoriteStocks(username, function(err, doc) {

		callback.call(this, err, doc);

	});

}

module.exports.delAllStocks = function() {
	global.OPER.delAllStocks();
}

module.exports.findStock = function(stockcode, callback) {

	global.OPER.findStock(stockcode, function(err, doc) {

		callback.call(this, err, doc);
	});

}

module.exports.addFavoriteStock = function(username, stockcode, stockex, callback) {

	global.OPER.addFavoriteStock(username, stockcode, stockex, function(err, doc) {

		callback.call(this, err, doc);

	});

}

module.exports.removeFavoriteStock = function(username, stockcode, callback) {

	global.OPER.removeFavoriteStock(username, stockcode, function(err) {

		callback.call(this, err);

	});

}

var getPricesData = function(code, ex, res) {

	var prices = new DailyPrices(code, ex);

	prices.start(function(ret, data) {
		console.log("ret:" + ret);

		if (ret == 0) {
			console.log('get success and send');
			return res.status(200).send({
				state: 'success',
				list: data
			});

		}

	});
}

module.exports.stockhisprices = function(req, res) {

	var stockcode = req.body.code;

	console.log('code:' + req.body.code);

	global.OPER.findStock(stockcode, function(err, stock) {

		if (stock) {

			global.OPER.findPrices(stock.code, function(err, docs) {

				if (err) {
					console.log("error to find stock price");
					res.sendStatus(500);

				} else if (!docs || !docs[0]) {
					console.log("not found and will get from remote");

					getPricesData(stock.code, stock.ex, res);


				} else {

					console.log(docs[0]);
					// console.log(docs.length);

					return res.status(200).send({
						state: 'success',
						list: docs
					});
				}
			});

		} else {
			console.log("not found:" + stockcode);
			res.sendStatus(500);
		}

	});
}