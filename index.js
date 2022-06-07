const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const createAlert = (socket, type, text, status, id = 0) => {
	socket.emit('alert status', {
		type,
		text,
		status,
		id
	})
}

io.on('connection', (socket) => {
	socket.on('room', (room) => {
		socket.room = room
		socket.join(room);
	})

	socket.on('change chat', () => {
		socket.leave(socket.room, error => console.log(error))

		createAlert(socket, 'info', 'Вы успешно покинули чат!', 0)
	})

	socket.on('connect chat', room => {
		socket.room = room
		socket.join(room)

		createAlert(socket, 'success', `Вы присоединились к чату. ID: ${room}`, 1, room)
	})

	socket.on('chat message', (msg) => {
		io.sockets.in(socket.room).emit('chat message', msg);
	});

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

