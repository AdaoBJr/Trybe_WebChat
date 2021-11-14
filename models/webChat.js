const connection = require('./connection');

const clear = async () =>
  connection().then((db) => db.collection('messages').deleteMany({}));

const save = async (message) => {
  connection().then((db) => db.collection('messages').insertOne(message));
};

const getAll = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  clear,
  save,
  getAll,
}; 