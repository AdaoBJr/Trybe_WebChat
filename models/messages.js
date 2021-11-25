// const { ObjectId } = require('mongodb');

const mongoConnection = require('./connection');

const addMessageToChat = async ({ chatMessage, nickname }) => {
  try {
    const userColletion = await mongoConnection
    .connection()
    .then((db) => db.collection('messages'));
  
    const insertedMessage = await userColletion.insertOne({ 
      chatMessage, nickname, date: new Date('<dd-mm-YYYYTHH:MM:ss>'), 
    });
  
    return insertedMessage;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addMessageToChat,
};
