const connection = require('./connection');

const collection = async () => connection()
  .then((db) => db.collection('messages'));

const create = async (data) => collection()
  .then((col) => col.insertOne(data).then(({ ops }) => ops[0]));

const getAll = async () => collection()
  .then((allMessages) => allMessages.find().toArray());

module.exports = { create, getAll };