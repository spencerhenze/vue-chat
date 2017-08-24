
//normal node express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(server);// setting up socket io

app.use(express.static(__dirname + '/../client'));

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});



io.on('connection', function (socket) {//socket - who connected(client)

	// socket.join('BCW', function () {//join chat room

	// });

	socket.on('leave', function () {
		io.to(socket.room).emit('left', socket.user);
	});

	socket.on('join', function (room, name) {//join topic name - socket add user property = name / io is the actual server - emit a message to everyone who has joined the channel
		if (name && room) {
			socket.join(room)
			socket.user = name;
			socket.room = room;
			io.to(room).emit('user', name);
		}
	});

	socket.on('message', function (text) {//when a message comes in, emit message: this is  the user, this is the message
		if (text) {
			io.to(socket.room).emit('message', { user: socket.user, message: text, imageurl: false, linkurl: false });
		}
	});

	socket.on('roomAdded', function (roomName) {
		if (roomName){
			io.emit('roomAdded', {value: roomName.toLowerCase(), text: roomName})
		}
	})

	socket.on('image', function (image) {//when an image comes in, emit message object
		if (image) {
			io.to(socket.room).emit('message', { user: socket.user, message: false, imageurl: image, linkurl: false });
		}
	});

	socket.on('link', function (link) {//when a link comes in, emit message object
		if (link) {
			io.to(socket.room).emit('message', { user: socket.user, message: false, imageurl: false, linkurl: link });
		}
	});


	socket.on('disconnect', (reason) => {
		io.to(socket.room).emit('left', socket.user);
	})
});