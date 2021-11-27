const moment = require('moment'); // https://momentjs.com/
const connection = require('./connection');

const createMessage = async ({ chatMessage, nickname }) => {
  const db = await connection();
  const timestamp = moment().format('DD-MM-yyyy LTS');
  await db.collection('messages').insertOne({ timestamp, nickname, message: chatMessage });
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const getAllMessage = async () => {
  try {
    const db = await connection();
    const test = await db.collection('messages').find().toArray();
    console.log(test);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createMessage, getAllMessage };