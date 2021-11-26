const connection = require('./connection');
const { formattedDateAndHour } = require('../helpers/dateAndHour');

const saveMessages = async (body) => {
  const db = await connection();
  const dateAndHour = formattedDateAndHour();

  const { ops } = await db.collection('messages').insertOne({
    ...body, timestamp: dateAndHour,
  });

  const { chatMessage, nickname, timestamp } = ops[0];
  return { message: chatMessage, nickname, timestamp };
};

const getAll = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find({}).toArray();

  return messages;
};

module.exports = { saveMessages, getAll };