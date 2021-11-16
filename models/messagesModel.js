const connection = require('./connection');

const getAllMessages = async () => {
  const db = await connection();
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
};

const addMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({
    message,
    nickname,
    timestamp,
  });

  return newMessage;
};

module.exports = {
  getAllMessages,
  addMessage,
};
