const connection = require('./connection');

const findMsgs = async () => {
  const dbConnection = await connection();
  const allMsgs = await dbConnection.collection('messages').find().toArray();
  return allMsgs;
};

const registerMsgs = async ({ date, chatMessage, nickname }) => {
  const dbConnection = await connection();
  const postedMsg = await dbConnection
    .collection('messages')
    .insert({ date, chatMessage, nickname });
  return postedMsg;
};

module.exports = { findMsgs, registerMsgs };
