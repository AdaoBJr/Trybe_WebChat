const connection = require('./connection');

const saveMessage = async ({ message, nickname, timeStamp }) => {
  await connection().then((db) => db.collection('messages').insertOne(
    { message, nickname, timeStamp },      
  ));
  return null;
};

const getMessages = async () => {
  const messages = await connection()
    .then((db) => db.collection('messages').find({}).toArray());
  return messages;
};

module.exports = { saveMessage, getMessages };