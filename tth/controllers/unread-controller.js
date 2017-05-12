module.exports.unread = function(req, res) {

	var uname = req.body.username;

	global.OPER.findUser(uname, function(err, user) {

		if (err) {

			res.sendStatus(500);

		} else {

			res.status(200).send({
				state: 'success',
				unread: user.unread
			});
		}

	});

};

//确认未读消息
module.exports.asureUnread = function(req, res) {

	var id = req.body._id;

	global.OPER.findUserByUnread(id, function(err, user) {

		if (err) {
			res.sendStatus(500);
		} else {
			for (var i = 0; i < user.unread.length; i++) {
				if (user.unread[i]._id == id) {
					user.unread[i].asure = true;
					
					user.save(function(err) {
						if (err) {
							res.sendStatus(500);
						} else {
							res.status(200).send({
								state: 'success',
								unread: user.unread
							});
						}
					});
				}
			}
		}
	});
};