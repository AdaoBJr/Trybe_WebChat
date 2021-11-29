const connection = require('./connection');

const addMessage = async (message, nickname, timestamp) => {
  const db = await connection();

  await db.collection('messages').insertOne({ message, nickname, timestamp });
};

const getAllMessages = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

module.exports = {
  addMessage,
  getAllMessages,
};
