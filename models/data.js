const moment = require('moment'); // https://momentjs.com/
const connection = require('./connection');

const createMessage = async ({ chatMessage, nickname }) => {
  const db = await connection();
  const timestamp = moment().format('DD-MM-yyyy LTS');
  await db.collection('messages').insertOne({ timestamp, nickname, message: chatMessage });
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const getAllMessages = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

module.exports = { createMessage, getAllMessages };