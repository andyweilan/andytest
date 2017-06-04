var RealTimeData = require("./RealTime");

var RealTimeManager = function() {

	this.usersMap = [];

	this.realTimeArray = [];

};

RealTimeManager.prototype.add = function(username, socket, stList) {

	if (!this.usersMap[username]) {
		this.usersMap[username] = socket;
	}

	if (!(this.realTimeArray[username])) {

		var realtimedata = new RealTimeData(stList);

		this.realTimeArray[username] = realtimedata;

		realtimedata.pollingLoop(socket);

	}

};

RealTimeManager.prototype.remove = function(socket) {

	var username = this.findNamebySocket(socket);

	if (username && this.realTimeArray[username]) {

		if (this.realTimeArray[username].decreaseCounter() <= 0) {
			delete this.realTimeArray[username];

			delete this.usersMap[username];

			console.log('remove:' + username);
		}

	}

};

RealTimeManager.prototype.find = function(username) {

	if (this.usersMap[username]) {
		return true;
	}

	return false;

};

RealTimeManager.prototype.findNamebySocket = function(socket) {

	for (var name in this.usersMap) {
		if (this.usersMap[name] == socket) {

			console.log('found the name:' + name);
			return name;
		}
	}

	return '';

};

RealTimeManager.prototype.increase = function(username) {

	if (this.realTimeArray[username]) {
		this.realTimeArray[username].increaseCounter();
	}

};


module.exports = RealTimeManager;