// Faça seu código aqui
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http').createServer(express());
const socketio = require('socket.io');
const path = require('path');
const routes = require('./routes');

class App {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.io = socketio(http, {
      cors: {
        origin: 'https://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(express.static(path.join(__dirname, 'public')));
  }

  routes() {
    this.express.use(routes);
    this.express.use(cors());
  }
}

module.exports = new App();
