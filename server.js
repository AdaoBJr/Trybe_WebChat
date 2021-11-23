// Faça seu código aqui
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const moment = require('moment');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

require('./sockets/chatSocket')(io);

app.use(express.static(`${__dirname}/views`));

const { getMessages } = require('./models/messagesModel');

app.get('/', async (req, res) => {
  const allMessages = await getMessages();
  const messages = allMessages.map(({ message, nickname, timestamp }) =>
  `${timestamp} - ${nickname}: ${message}`);
  res.render('index', { messages });
});

// app.get('/', async (req, res) => {
//   const allUsers = await getUsers();
//   // const users = allUsers.map(({ nickname }) =>
//   // `${nickname}`);
//   res.render('index', { allUsers });
// });

http.listen(PORT, () => console.log(`listening on port ${PORT}`));
