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
// const modifyOnUsers = require('./views/js/util/modifyOnUsers');

const { setMessage, getMessages } = require('./models/modelChat');

let onUser = [];
const formatDateDb = 'DD-MM-YYYY HH:mm:ss';
const date = moment().format(formatDateDb);
let arrU = [];
let newAr = [];

io.on('connection', (socket) => {
  socket.on('new user', async (data) => {
    onUser.unshift({ data, id: socket.id }); const messageDB = await getMessages();
    io.emit('new user', { onUsers: onUser }); io.emit('historyMessage', messageDB);
  });
  socket.on('edit user', async ({ nick, oldNick }) => {
    if (onUser.findIndex((obj) => obj.data === oldNick) !== -1) { 
      onUser[onUser.findIndex((obj) => obj.data === oldNick)] = { data: nick, id: socket.id };
      io.emit('edit user', onUser);
    }
  });
  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const mesReturn = formatMessage(getTheCurrentDate(), message, nickname);
    await setMessage({ message: mesReturn, nickname, date }); io.emit('message', mesReturn);
  });

  socket.on('disconnect', () => {
    newAr = onUser.find((e) => e.id === socket.id); arrU = onUser.filter((e) => e.id !== socket.id);
    onUser = arrU; io.emit('user disconnected', newAr);
  });
});

app.get('/', (req, res) => {
  res.status(200).render('client', { users: onUser });
});