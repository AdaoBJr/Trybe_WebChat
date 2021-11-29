require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http');

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server, {
  cors: {
    origin: `http://localhost${3000}`,
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/src`));

let onlineUsers = [];

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const now = new Date().toLocaleString().replace(/\//g, '-');
    io.emit('message', `${now} - ${nickname}: ${chatMessage}`);
  });

  socket.on('userOnline', (nickname) => {
    onlineUsers.push([nickname, socket.id]);

    io.emit('userOnline', onlineUsers);
  });
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(([, id]) => id !== socket.id);

    io.emit('userOnline', onlineUsers);
  });
});

io.on('connection', (socket) => {
  socket.on('updateNickname', (nickname) => {
    onlineUsers = onlineUsers.map((el) => {
      if (el[1] === socket.id) return [nickname, socket.id];
      return el;
    });

    io.emit('userOnline', onlineUsers);
  });
});

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/src/views/index.html`);
});
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
