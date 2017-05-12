var express = require('express');
var router = express.Router();

var unreadController = require('../controllers/unread-controller.js');

router.route("/list").post(unreadController.unread);


router.route("/asure").post(unreadController.asureUnread);

module.exports = router;
