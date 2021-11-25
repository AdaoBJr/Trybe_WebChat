const connection = require('./connection');

const dateFormater = () => {
  const today = new Date();
  const dateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  return today.toLocaleDateString('pt-br', dateOptions).replace(/\//g, '-');
};

const hourFormater = () => {
  const today = new Date();

  return `${today.toLocaleTimeString('en-us')}`;
};

const newMessage = async (message, nickname) => {
  const db = await connection();

  await db.collection('messages').insertOne({
    message, nickname, timestamp: `${dateFormater()} ${hourFormater()}`,
  });

  return { message, nickname, timestamp: `${dateFormater()} ${hourFormater()}` };
};

const allMessages = async () => {
  const db = await connection();
  const list = await db.collection('messages').find({}).toArray();

  return list;
};

module.exports = {
  newMessage,
  allMessages,
};
