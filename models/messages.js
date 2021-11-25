// const { ObjectId } = require('mongodb');
const moment = require('moment');

const connection = require('./connection');

const addMessageToChat = async ({ chatMessage, nickname }) => {
  try {
    const date = moment().format('DD-MM-YYYY HH:mm:ss a');

    const message = `${date} - ${nickname}: ${chatMessage}`;

    const messageCollection = await connection()
    .then((db) => db.collection('messages'));
  
    await messageCollection.insertOne({
      message: chatMessage,
      nickname,
      timestamp: date,
     });
  
    return message;
  } catch (error) {
    console.log(error);
  }
};

const getAllMessages = async () => {
  const messageCollection = await connection()
  .then((db) => db.collection('messages'));

  const allMessages = await messageCollection.find({}).toArray();
  return allMessages;
};

module.exports = {
  addMessageToChat,
  getAllMessages,
};
