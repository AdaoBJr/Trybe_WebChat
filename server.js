// Faça seu código aqui
const express = require('express');
const app = express();
const http = require('http').createServer(app);
require('dotenv').config();

const port = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.get('/', (req, res) => {
  res.sendFile(_dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Server listening on ${port}`)
});
