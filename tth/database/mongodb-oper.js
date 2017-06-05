var mongoose = require('mongoose');

var modelsCreate = require('./models-create');

var User = modelsCreate.getModel('user');

var FavorStocks = modelsCreate.getModel('favorstocks');

var Stock = modelsCreate.getModel('stock');


var dboperator = function() {

};

dboperator.prototype.findUser = function(uname, callback) {

	User.findOne({
		username: uname
	}, function(err, doc) {
		callback.call(this, err, doc);
	});

};

dboperator.prototype.findUserByUnread = function(id, callback) {

	User.findOne({
		'unread._id': id
	}, function(err, doc) {
		callback.call(this, err, doc);
	});

};

dboperator.prototype.createUser = function(uname, upwd, callback) {

	User.create({ // 创建一组user对象置入model
		username: uname,
		password: upwd
	}, function(err, doc) {
		callback.call(this, err, doc);
	});
};

dboperator.prototype.createFavoriteStock = function(uname, callback) {

	FavorStocks.create({
		username: uname
	}, function(err, doc) {
		callback.call(this, err, doc);
	});

};

dboperator.prototype.findFavoriteStocks = function(uname, callback) {

	FavorStocks.findOne({
		username: uname
	}, function(err, doc) {
		callback.call(this, err, doc);
	});

};

dboperator.prototype.addOneStock = function(user, stockcode, stockex, callback) {

	var newStock = {
		stockcode: stockcode,
		ex: stockex

	};

	user.stocks.push(newStock);

	user.save(function(err, doc) {

		if (doc) {
			console.log("add new stock success:" + stockcode);
		}

		callback.call(this, err, doc);

	});

};

dboperator.prototype.addFavoriteStock = function(uname, stockcode, stockex, callback) {

	var self = this;

	FavorStocks.findOne({
		username: uname
	}, function(err, doc) {

		if (err) {
			callback.call(this, err, doc);
		} else if (doc) {

			console.log("FavorStocks:found user");

			var exist = false;

			for (var i = 0; i < doc.stocks.length; ++i) {

				if (stockcode == doc.stocks[i].stockcode) {
					exist = true;
					break;
				}

			}

			if (!exist) {

				self.addOneStock(doc, stockcode, stockex, callback);

			} else {

				console.log("id already exists:" + stockcode);

			}

		} else {

			self.createFavoriteStock(uname, function(err, doc) {

				if (doc) {

					console.log("FavorStocks:create user");

					self.addOneStock(doc, stockcode, stockex, callback);
				}else{

					callback.call(this, err, doc);
				}

			});

		}
	});

};

dboperator.prototype.insertStockIds = function(ids, callback) {

	Stock.create(ids, function(err, doc) {

		callback.call(this, err, doc);
	});

};

dboperator.prototype.findStocksList = function(id, num, callback) {

	Stock.find({
		code: new RegExp('^' + id)
	}, {
		code: 1,
		name: 1,
		ex: 1
	}, function(err, docs) {

		callback.call(this, err, docs);

	}).limit(num);
};

dboperator.prototype.findStock = function(stockcode, callback) {

	Stock.findOne({
		code: stockcode
	}, function(err, doc) {

		callback.call(this, err, doc);

	});

};

dboperator.prototype.delAllStocks = function() {

	mongoose.connection.collections['stocks'].drop(function(err) {
		console.log('stocks collection dropped');
	});

};

module.exports = dboperator;