const connection = require('./connection');

const saveMessage = (data) =>
connection().then((db) => db.collection('messages').insertOne({ ...data }));

const getAllMessages = () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  getAllMessages,
  saveMessage,
};