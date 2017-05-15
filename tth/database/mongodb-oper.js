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

dboperator.prototype.findFavoriteStocks = function(uname, callback) {

	FavorStocks.findOne({
		username: uname
	}, function(err, doc) {
		callback.call(this, err, doc);
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
		name: 1
	}, function(err, docs) {

		callback.call(this, err, docs);

	}).limit(num);
};

dboperator.prototype.delAllStocks = function() {

	mongoose.connection.collections['stocks'].drop(function(err) {
		console.log('stocks collection dropped');
	});

};

module.exports = dboperator;