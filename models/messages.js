// const { ObjectId } = require('mongodb');

const connection = require('./connection');

const addMessageToChat = async (message) => {
  try {
    const messageCollection = await connection()
    .then((db) => db.collection('messages'));
  
    const insertedMessage = await messageCollection.insertOne({ message });
  
    return insertedMessage;
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
