const connection = require('./connection');

const newMessage = (message, nickname, timestamp) => 
  connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

const getMessages = () =>
   connection()
   .then((db) => db.collection('messages').find().toArray());

module.exports = {
  newMessage,
  getMessages,
};