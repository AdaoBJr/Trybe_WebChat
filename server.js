require('dotenv').config();
const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();

const { PORT = 3000 } = process.env;

// app.use(express.static(path.join(__dirname, 'src/public')));
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/views`)); // define uma rota estática para uma pasta
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const httpServer = require('http').createServer(app);

const options = {
  cors: {
    origin: [`http://localhost:${PORT}`], // urls aceitas pelo cors
    methods: ['GET', 'POST'], // métodos aceitos pelas urls
  },
};

const io = require('socket.io')(httpServer, options);

// app.use(
//   cors({
//     origin: [`http://localhost:${PORT}`], // urls aceitas pelo cors
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos aceitos pelas urls
//     allowedHeaders: ['Authorization'],
//   }),
// );

const chatHistory = [];
const usersOnline = {};

// const { generateUsername } = require('unique-username-generator');

io.on('connection', (socket) => {
  // socket.disconnect(0);  
  usersOnline[socket.id] = { username: socket.id.substring(0, 16), id: socket.id };
  console.log(`${usersOnline[socket.id].username} conectou`);

  io.emit('updateUsersOnline', { usersOnline: Object.values(usersOnline) });
  
  socket.on('setNickname', ({ username }) => {
    // const oldUsername = usersOnline[socket.id].username;
    usersOnline[socket.id].username = username;
    io.emit('updateUsersOnline', { usersOnline: Object.values(usersOnline) });
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy h:mm:ss A');    
    const { username } = usersOnline[socket.id];
    chatHistory.push(`${timestamp} - ${nickname || username}: ${chatMessage}`);
    io.emit('message', `${timestamp} - ${nickname || username}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    console.log(`${usersOnline[socket.id].username} desconectou`);
    delete usersOnline[socket.id];
    socket.broadcast.emit('updateUsersOnline', { usersOnline: Object.values(usersOnline) });
  });
});

app.get('/', (req, res) => {
  // const username = generateUsername('', 0, 16);
  
  res.status(200).render('board', { 
    /* username, */ chatHistory, usersOnline: Object.values(usersOnline),
  });
});

// app.post('/', (req, res) => {
//   res.render('board');
// });

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});