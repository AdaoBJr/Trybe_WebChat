const webchat = require('../models/webchat');

const newMessage = async (chatMessage, nickname, dateNow) => {
  await webchat.newMessage(chatMessage, nickname, dateNow);
};

module.exports = { newMessage };
