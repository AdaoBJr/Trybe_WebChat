// Faça seu código aqui
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

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    const now = new Date().toLocaleString().replace(/\//g, '-');
    io.emit('message', `${now} - ${nickname}: ${chatMessage}`);
  });
});

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/src/views/index.html`);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}); 
