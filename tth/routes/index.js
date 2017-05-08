var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// router.get('/', function(req, res,next){
// 	console.log(req.session);
// 	res.sendfile('index.html');
// });

module.exports = router;
