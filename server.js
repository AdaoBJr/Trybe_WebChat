const express = require('express');
const cors = require('cors');
const moment = require('moment');

const port = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${port}`,
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/chatController');
const chatModel = require('./models/chatModel');

require('dotenv').config();

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const randomizeNickName = (nick) => {
  let nickName = '';
  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = possibleCharacters.length;
  for (let index = 0; index < nick; index += 1) {
    nickName += possibleCharacters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return nickName;
};

const usersOnline = [];
const newUserOnline = () => {
  const randomNick = randomizeNickName(16);
  usersOnline.push(randomNick);
  return randomNick;
};

// FONTE: https://stackoverflow.com/questions/8073673/how-can-i-add-new-array-elements-at-the-beginning-of-an-array-in-javascript
const newUserOnTop = (user) => {
  const arrayUsers = usersOnline.slice(0, -1);
  arrayUsers.unshift(user);
  return arrayUsers;
};

// FONTE moment().format(): https://ifpb.github.io/jaguaribetech/2016/09/01/moment-js/#:~:text=Para%20rodar%20a%20Moment%20no,funcionalidades%20de%20manipula%C3%A7%C3%A3o%20de%20datas.
const userCreate = async ({ nickname, chatMessage }) => {
  const date = moment().format('DD-MM-YYYY HH:MM:SS');
  const message = `${date} ${nickname} ${chatMessage}`;
  await chatModel.registerMsgs(message);
  return message;
};

io.on('connection', (socket) => {
  let user = newUserOnline();
  newUserOnTop(user);

  socket.on('disconnect', () => {
    usersOnline.splice(usersOnline.indexOf(user), 1);
    io.emit('userOnline', usersOnline);
  });

  socket.emit('randomNickName', user);

  socket.emit('userOnline', newUserOnTop(user));

  socket.broadcast.emit('onlineUser', usersOnline);

  socket.on('nickNameChange', (changedNickName) => { 
    usersOnline.splice(usersOnline.indexOf(user), 1, changedNickName);
    user = changedNickName;
    io.emit('userOnline', newUserOnTop(user));
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const newUser = await userCreate({ nickname, chatMessage });
    io.emit('message', newUser);
  });
});

app.get('/', (_req, res) => {
  res.render('index.ejs');
});

app.get('/messages', chatController.findMsgs);

http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
