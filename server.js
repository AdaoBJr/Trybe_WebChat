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

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);
  socket.on('onload', () => console.log('teste'));
 
  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy h:mm:ss A');
    // console.log('date: ', date);
    // console.log('OI GALERA:', nickname);
    
    // console.log(`SERVER message: ${nickname}: ${chatMessage}`);
    chatHistory.push(`${timestamp} - ${nickname}: ${chatMessage}`);
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
});
const { generateUsername } = require('unique-username-generator');

app.get('/', (req, res) => {
  res.status(200).render('board', { 
    username: generateUsername('', 0, 16), chatHistory, 
  });
});

// app.post('/', (req, res) => {
//   res.render('board');
// });

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});