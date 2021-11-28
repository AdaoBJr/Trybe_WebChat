const webchat = require('../models/webchatModels');

const newMessage = async (message, nickname, timestamp) => {
  await webchat.newMessage(message, nickname, timestamp);
};

const getAllMessages = async () => webchat.getAllMessages();

module.exports = { newMessage, getAllMessages };
