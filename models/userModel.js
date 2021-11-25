// const { ObjectId } = require('mongodb');

const mongoConnection = require('./connection');

const createUser = async ({ name }) => {
  try {
    const userColletion = await mongoConnection
    .connection()
    .then((db) => db.collection('users'));
  
    const user = await userColletion.insertOne({ name });
  
    return user;
  } catch (error) {
    console.log(error);
  }
};

// const getAll = async () => {
//   const productsCollection = await mongoConnection
//     .connection()
//     .then((db) => db.collection('products'));

//   const products = await productsCollection.find({});

//   return products;
// };

// const updateCurrentOffer = async (id = '617717d7d23ede171536dc55') => {
//   const productsCollection = await mongoConnection
//   .connection()
//   .then((db) => db.collection('products'));

//   await productsCollection.updateOne({ id }, { $inc: { currentOffer: 5 } });
// };

// const getById = async (id = '617717d7d23ede171536dc55') => {
//   const productsCollection = await mongoConnection
//   .connection()
//   .then((db) => db.collection('products'));

//   const updatedProduct = await productsCollection.findOne({ id });

//   return updatedProduct;
// };

module.exports = {
  createUser,
};
