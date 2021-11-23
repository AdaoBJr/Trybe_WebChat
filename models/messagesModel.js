const connection = require('./connection');

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find({}).toArray();
  return messages;
};

const sendMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({
    message,
    nickname,
    timestamp,
  });
  return newMessage;
};

// const getUsers = async ({ nickname }) => {
//   const db = await connection();
//   const getUser = await db.collection('messages').find({
//     nickname,
//   });
//   return getUser;
// };

module.exports = { 
  getMessages,
  sendMessage,
  // getUsers,
};
