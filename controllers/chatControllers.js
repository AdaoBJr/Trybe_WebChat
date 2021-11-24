const model = require('../models/chatModels');

const saveMessage = async ({ message, nickname, timeStamp }) => {
  await model.saveMessage({ message, nickname, timeStamp });
};

const getAllMessages = async () => {
  const messages = await model.getMessages();
  return messages;
};

module.exports = {
  saveMessage,
  getAllMessages,
};