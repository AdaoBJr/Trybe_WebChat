const connect = require('./connection');

const write = async (message) => connect().then((db) => {
    db.collection('messages').insertOne(message);
});

const read = async () => {
    const response = await connect().then((db) => 
        db.collection('messages').find({}).toArray());
        return response;
};

module.exports = { write, read };