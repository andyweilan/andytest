var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth-controller.js');


router.route("/register").get(function(req, res) {

	res.status(200).send({
		state: 'failure',
		user: null,
		message: '服务器出错'
	});


}).post(authController.register);

router.route("/register/existedUser").get(function(req, res) {

	res.status(200).send({
		state: 'failure',
		user: null,
		message: '用户名已存在'
	});

});

router.route("/login").get(function(req, res) {

	res.status(200).send({
		state: 'failure',
		user: null,
		message: '服务器出错'
	});


}).post(authController.login);


router.route("/login/userError").get(function(req, res) {

	res.status(200).send({
		state: 'failure',
		user: null,
		message: '用户名或密码错误'
	});

});


module.exports = router;