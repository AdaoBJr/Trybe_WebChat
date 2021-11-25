// Faça seu código aqui
const express = require('express');
require('dotenv');

const PORT = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).render('index');
});
  
require('./controllers/messageSocket')(io);
require('./controllers/userSocket')(io);

http.listen(PORT, () => {
  console.log(`Online na porta ${PORT}`);
});
