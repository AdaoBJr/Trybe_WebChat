require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('message', ({ chatMessage, nickname }) => {
    const time = moment().format('DD-MM-yyyy h:mm:ss A');
    const message = `${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
