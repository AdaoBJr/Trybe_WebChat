require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { ChatServer } = require('./server/index');

const server = new ChatServer(io);

server.init();

app.set('view engine', 'ejs');
app.set('views', './public');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.get('/', (_req, res) => {
  res.status(200).render('index');
});

module.exports = http;
