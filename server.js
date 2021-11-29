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

const { getAllMessages } = require('./src/controllers/messagesController');

require('./src/sockets/message')(io);
require('./src/sockets/onlineUsers')(io);

app.use(express.static(`${__dirname}/src`));

app.get('/messages', getAllMessages);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/src/views/index.html`);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
