const connection = require('./connection');

const getMessages = async () => {
  const connectionDb = await connection();
  return connectionDb.collection('messages').find().toArray();
}; 

const setMessage = async ({ message, nickname, date }) => {
  const connectionDb = await connection();
  return connectionDb.collection('messages').insertOne({ nickname, message, date });
};  

module.exports = { getMessages, setMessage };