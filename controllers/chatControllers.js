const model = require('../models/chatModels');

const saveMessage = async (message) => {
  await model.saveMessage(message);
};

const getMessages = async () => {
  await model.getMessages();
};

module.exports = {
  saveMessage,
  getMessages,
};