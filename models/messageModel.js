// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const create = async (name, email, password) => {
  const db = await connection();
  const user = await db.collection('users')
    .insertOne({ name, email, password, role: 'user' });
    return { user: { name, email, role: 'user', _id: user.insertedId } };
};

const findByEmail = async (email) => {
  const userEmail = await connection()
    .then((db) => db.collection('users').findOne({ email }));

  if (!userEmail) return null;

  return (userEmail);
};

module.exports = {
  create,
  findByEmail,
};