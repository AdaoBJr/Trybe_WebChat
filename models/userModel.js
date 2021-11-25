// const { ObjectId } = require('mongodb');

const connection = require('./connection');

const addUserToList = async ({ socketId, nickname }) => {
  try {
    const userColletion = await connection()
      .then((db) => db.collection('users'));
    const name16 = nickname || socketId.slice(0, 16);
    await userColletion.insertOne({ socketId, nickname: name16 });
    console.log(name16);
    return name16;
  } catch (error) {
    console.log(error);
  }
};

const removeUserFromOnlineList = async ({ socketId }) => {
  const userColletion = await connection()
  .then((db) => db.collection('users'));

  await userColletion.deleteOne({ socketId });
};

const getAllUsers = async () => {
  const userColletion = await connection()
  .then((db) => db.collection('users'));

  const users = await userColletion.find({}).toArray();

  return users;
};

const setUserNickName = async ({ socketId, nickname }) => {
  const userColletion = await connection()
  .then((db) => db.collection('users'));

  const user = await userColletion.findOne({ socketId });

  if (!user) {
    await addUserToList({ socketId, nickname });

    return true; 
  }
  await userColletion.updateOne(
    { socketId }, 
    { $set: { nickname } },
  );
  
  return true;
};

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
  addUserToList,
  removeUserFromOnlineList,
  getAllUsers,
  setUserNickName,
};
