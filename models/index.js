const connection = require('./connection');

const saveMessages = async (message) => {
  console.log('salvou');
    await connection().then((db) => db.collection('messages').insertOne({ message }));
};

module.exports = { saveMessages };