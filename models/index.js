const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) =>
  connection().then((db) => db
    .collection('messages')
    .insertOne({ message, nickname, timestamp }));

module.exports = {
  createMessage,
};