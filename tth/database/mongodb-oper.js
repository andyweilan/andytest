var mongoose = require('mongoose');

var modelsCreate= require('./models-create');

var User = modelsCreate.getModel('user');


var dboperator = function(){

};

dboperator.prototype.findUser = function(uname, callback) {

	User.findOne({
		username: uname
	}, function(err, doc) {
		callback.call(this, err, doc);
	});

};

dboperator.prototype.createUser = function(uname, upwd, callback) {

	User.create({ // 创建一组user对象置入model
		username: uname,
		password: upwd,
		rights: 0,
		age: 18
	}, function(err, doc) {
		callback.call(this, err, doc);
	});
};

module.exports = dboperator;