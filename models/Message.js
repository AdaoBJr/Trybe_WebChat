const connection = require('./connection');

const getAll = () =>
  connection().then((db) => db.collection('messages').find().toArray());

const addMessage = (data) =>
  connection().then((db) => db.collection('messages').insertOne({ ...data }));

module.exports = {
  getAll,
  addMessage,
};
