// Estrutura do Banco de dados
const connection = require('./connection');

const getAllMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find({}).toArray();
  return messages.map(({ nickname, chatMessage, date }) => `${date} - ${nickname}: ${chatMessage}`);
};

const sendMessage = async (chatMessage, nickname, date) => {
  const db = await connection();
  await db.collection('messages').insertOne({
    nickname,
    chatMessage,
    date,
  });
};

module.exports = {
  getAllMessages,
  sendMessage,
};