const moment = require('moment'); // https://momentjs.com/
const connection = require('./connection');

const createMessage = async ({ chatMessage, nickname }) => {
  // const db = await connection();
  // const timestamp = moment().format('DD-MM-yyyy LTS');
  // await db.collection('messages').insertOne({ timestamp, nickname, message: chatMessage });
  // return `${timestamp} - ${nickname}: ${chatMessage}`;
};

// const updateUser = async (newNick) => {
  //   console.log(newNick);
  //   const db = await connection();
  //   const test = await db.collection('messages').updateOne({ nickname: newNick });
  //   console.log('quero ver esse', test);
  //     return test;
  // };
  
  const getAllMessage = async () => {
    try {
      const db = await connection();
      const test = await db.collection('messages').find();
      console.log(test);
    } catch (error) {
      console.log(error);
    }
  // return db.collection('messages').find().toArray();
};

module.exports = { createMessage, getAllMessage };