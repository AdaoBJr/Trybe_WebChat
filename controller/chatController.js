const messagesModel = require('../models/messages');
const { getAll } = require('../models/messages');

const saveMessages = async (body) => {
  const messages = await messagesModel.saveMessages(body);
  return messages;
};

const getAllMessages = () => getAll();

module.exports = { saveMessages, getAllMessages };