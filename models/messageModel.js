// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => 
connection()
.then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp/* : new Date() */ }))
.then(({ insertedId, ops: [result] }) => ({
  id: insertedId,
  message: result.message,
  nickname: result.nickname,
  timestamp: result.timestamp,
}));

const findAllMessages = async () => 
connection()
.then((db) => db.collection('messages').find().toArray());

// createMessage({ message: 'Oi, tudo blz?', nickname: 'dg' }).then((resultado) => console.log(resultado));

module.exports = {
  createMessage,
  findAllMessages,
};