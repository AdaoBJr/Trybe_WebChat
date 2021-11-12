// Faça seu código aqui
const moment = require('moment');
const express = require('express');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const socketServer = require('socket.io');

const io = socketServer(server);

app.use(express.json());
app.use(express.static(`${__dirname}/views`));

const formatMessage = require('./views/js/util/formatMessage');
const getTheCurrentDate = require('./views/js/util/getTheCurrentDate');
const { setMessage, getMessages } = require('./models/modelChat');

let activeUsers = [];
io.on('connection', (socket) => {
  console.log(`${socket.id} usuario conectado`);

  socket.on('new user', async (data) => {
    activeUsers.unshift({ data, id: socket.id });
    const arrayOfMessages = await getMessages();
    console.log(arrayOfMessages);
    io.emit('new user', { activeUsers, arrayOfMessages });
  });

  socket.on('edit user', ({ newNickName, oldNickName }) => {
    if (activeUsers.findIndex((obj) => obj.data === oldNickName) !== -1) { 
      activeUsers[activeUsers.findIndex((obj) => obj.data === oldNickName)] = { data: newNickName, id: socket.id };
      io.emit('edit user', activeUsers);
    }
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const messageReturn = formatMessage(getTheCurrentDate(), message, nickname);
    const dateForDb = moment().format('DD-MM-YYYY HH:mm:ss');
    await setMessage({ message: messageReturn, nickname, dateForDb });
    io.emit('message', messageReturn);
  });

  socket.on('disconnect', () => {
    const newArray = activeUsers.find((user) => user.id === socket.id);
    const newActiveUsers = activeUsers.filter((e) => e.id !== socket.id);
    activeUsers = newActiveUsers;
    io.emit('user disconnected', newArray);
  });
});

app.get('/', (req, res) => {
  res.status(200).render('client', { users: activeUsers });
});