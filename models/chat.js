const connection = require('./connection');

async function newMessage(message, nickname, timestamp) {
  const db = await connection();
  await db.collection('messages').insertOne({ message, nickname, timestamp });
}

async function getMessages() {
  const db = await connection();
  const result = await db.collection('messages').find().toArray();
  return result;
}

module.exports = {
  newMessage,
  getMessages,
};
