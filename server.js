// Faça seu código aqui
const express = require('express');
const cors = require('cors');
require('dotenv');

const PORT = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:3001/'],
    methods: ['GET', 'POST'],
  } });

app.use(express.json());
app.use(cors());
  
require('./controllers/messageSocket')(io);

http.listen(PORT, () => {
  console.log(`Online na porta ${PORT}`);
});
