const connection = require('./connection');

async function addNewMessage(message, nickname, timestamp) {
  const db = await connection();
  await db.collection('messages').insertOne({ message, nickname, timestamp });
}

async function getAllMessages() {
  const db = await connection();
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
}

module.exports = {
  addNewMessage,
  getAllMessages,
};
