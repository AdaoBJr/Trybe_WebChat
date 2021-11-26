const moment = require('moment');
const chatDB = require('../models/Chat');

class ChatServer {
  constructor(io) {
    this.io = io;
    this.users = [];
    this.messages = [];
  }

  async getMessages(socket) {
    this.messages = await chatDB.getMessages();
    socket.emit('messageList', this.messages);
  }

  newMessage(socket) {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const timestamp = moment().format('DD-MM-yyyy h:mm:ss A');
      const formatedMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
      this.io.emit('message', formatedMessage);
      await chatDB.newMessage(chatMessage, nickname, timestamp);
    });
  }

  checkNickname(nickname, socket) {
    if (!this.users.includes(nickname)) {
      this.users.push({ name: nickname, id: socket.id });
    }
    return nickname;
  }

  newUser(socket) {
    socket.on('newNickname', (nickname) => {
      this.users = this.users.map((user) => {
        if (user.id === socket.id) {
          return { ...user, name: nickname };
        } return user;
      });
      this.io.emit('userList', this.users);
    });
  }

  startNickname(socket) {
    socket.on('nickname', (nickname) => {
      this.checkNickname(nickname, socket);
      this.io.emit('userList', this.users);
    });
  }
   
  removeUser(socket) {
    this.users = this.users.filter((user) => user.id !== socket.id);
  }

  init() {
    this.io.on('connection', (socket) => {
      this.newMessage(socket);
      this.newUser(socket);
      this.startNickname(socket);
      this.getMessages(socket);
      socket.on('disconnect', () => {
        this.removeUser(socket);
        this.io.emit('userList', this.users);
      });
    });
  }
}

module.exports = { ChatServer };