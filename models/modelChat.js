const connection = require('./connection');

const getMessages = async () => {
  const connectionDb = await connection();
  return connectionDb.collection('messages').find().toArray();
}; 

const setMessage = async ({ message, nickname, dateForDb }) => {
  const connectionDb = await connection();
  return connectionDb.collection('messages').insertOne({ nickname, message, dateForDb });
};  

module.exports = { getMessages, setMessage };