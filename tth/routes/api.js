var express = require('express');
var router = express.Router();

var stockController = require('../controllers/stock-controller.js');


router.route("/stocklist").get(function(req, res) {

}).post(stockController.stocklistlimit);

module.exports = router;