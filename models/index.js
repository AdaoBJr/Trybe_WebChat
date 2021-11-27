const connection = require('./connection');

const saveMessages = async (message) => {
    await connection().then((db) => db.collection('messages').insertOne({ message }));
};

module.exports = { saveMessages };