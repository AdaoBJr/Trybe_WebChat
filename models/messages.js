const conn = require('./connection');

const insertMessages = async (name, message, timeStamp) => {  
  conn().then((db) => db.collection('messages').insertOne({ name, message, timeStamp }))
  .then((response) => response.ops[0])
  .catch((error) => console.error(error.message));
};

const getAllMessages = async () => (
  conn().then(async (db) => {
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
  })
); 

module.exports = {
  insertMessages,
  getAllMessages,
};