const connection = require('./connection');

const registerMsgs = async (message) => {
    await connection().then((db) => db.collection('messages').insertOne({ message }));
};

const findMsgs = async () => connection().then((db) => db
.collection('messages').find({}).toArray());

module.exports = { registerMsgs, findMsgs };
