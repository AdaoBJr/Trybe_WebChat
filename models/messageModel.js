const connection = require('./connection');

const getAll = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

const createMessage = async (message, nickName, date) => {
  const db = await connection();
  await db.collection('messages').insertOne({
    nickName,
    message,
    date,
  });
};

module.exports = {
  getAll,
  createMessage,
};