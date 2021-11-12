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
const modifyOnUsers = require('./views/js/util/modifyArrayOnUsers');

const { setMessage, getMessages } = require('./models/modelChat');

let onUsers = [];
const formatDateDb = 'DD-MM-YYYY HH:mm:ss';
const date = moment().format(formatDateDb);

io.on('connection', (socket) => {
  socket.on('new user', async (data) => {
    onUsers.unshift({ data, id: socket.id });
    const arrayOfMessages = await getMessages(); io.emit('new user', { onUsers, arrayOfMessages });
  });
  socket.on('edit user', ({ newNickName, oldNickName }) => {
    if (onUsers.findIndex((obj) => obj.data === oldNickName) !== -1) { 
      modifyOnUsers(onUsers, newNickName, oldNickName, socket.id); io.emit('edit user', onUsers);
    }
  });
  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const mesReturn = formatMessage(getTheCurrentDate(), message, nickname);
    await setMessage({ message: mesReturn, nickname, date }); io.emit('message', mesReturn);
  });

  socket.on('disconnect', () => {
    const newArray = onUsers.find((user) => user.id === socket.id);
    const newActiveUsers = onUsers.filter((e) => e.id !== socket.id);
    onUsers = newActiveUsers; io.emit('user disconnected', newArray);
  });
});

app.get('/', (req, res) => {
  res.status(200).render('client', { users: onUsers });
});