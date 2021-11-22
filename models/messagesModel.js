const connection = require('./connection');

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find({}).toArray();
  return messages;
};

const sendMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({
    nickname,
    message,
    timestamp,
  });
  return newMessage;
};

module.exports = { 
  getMessages,
  sendMessage,
};
