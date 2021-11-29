const connection = require('./connection');

const getAll = () => connection()
  .then((db) => db.collection('messages').find().toArray());

const saveMessages = ({ nickname, message, timestamp }) => connection()
  .then((db) => db.collection('messages').insertOne({ nickname, message, timestamp }));

module.exports = {
  getAll,
  saveMessages,
};