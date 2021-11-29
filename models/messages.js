// Estrutura do Banco de dados
const connection = require('./connection');

const getAllMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find({}).toArray();
  return messages
    .map(({ nickname, message, formatedDate }) => `${formatedDate} - ${nickname}: ${message}`);
};

const sliceStringProperly = (string, start, end) => string.split('').slice(start, end).join('');

const formatDate = (now) => {
  const date = now;
  const day = sliceStringProperly(date, 0, 2);
  const month = sliceStringProperly(date, 3, 5);
  const year = sliceStringProperly(date, 6, 10);
  const time = sliceStringProperly(date, 11, 19);
  return `${year}-${month}-${day} ${time}`;
};

const sendMessage = async (message, nickname, now) => {
  const timestamp = formatDate(now);
  const db = await connection();
  await db.collection('messages').insertOne({
    nickname,
    message,
    formatedDate: now,
    timestamp,
  });
};

module.exports = {
  getAllMessages,
  sendMessage,
};