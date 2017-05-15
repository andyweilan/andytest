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


};