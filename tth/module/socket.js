var io = require('socket.io')();


io.sockets.on('connection', function(socket) {

  socket.emit('hello');

  var clientIp = socket.request.connection.remoteAddress;

  console.log('New connection from ' + clientIp);


  
});


exports.listen = function(_server) {
  return io.listen(_server);
};

