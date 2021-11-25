const { newMessage, allMessages } = require('../models/webchat');

const newMessageService = async (message, nickname) => {
  const insertedMessage = await newMessage(message, nickname);

  return insertedMessage;
};

const allMessagesService = async () => {
  const messages = await allMessages();

  return messages;
};

module.exports = {
  newMessageService,
  allMessagesService,
};
