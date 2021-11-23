require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', './public');

const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (_req, res) => {
  res.status(200).render('index');
});

require('./sockets/chat')(io);

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
