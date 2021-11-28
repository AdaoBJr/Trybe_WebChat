const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const date = `${day}-${month}-${year}`;

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    let time;

    if (hours > 12) time = `${hours}:${minutes}:${seconds} PM`; 
    else time = `${hours}:${minutes}:${seconds} AM`; 

    console.log(`${date} ${time}`);
    io.emit('message', `${date} ${time} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => { console.log(`Usuário desconectou: ${socket.id}`); });
});

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => {
  console.log('Escutando na porta 3000');
}); 