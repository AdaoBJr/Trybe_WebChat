const moment = require('moment');
const { getMessages, sendMessage } = require('../models/messagesModel');

const getAllMessages = async (req, res) => {
  try {
    const messages = await getMessages();
    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json({ message: 'Deu ruim!' });
  }
};

const sendThisMessage = async (req, res) => {
  try {
    const { nickname, message } = req.body;
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');

    await sendMessage({ message, nickname, timestamp });
    res.status(201).json({ message: 'Deu bom!' });
  } catch (e) {
    res.status(500).json({ message: 'Deu ruim!' });
  }
};

module.exports = {
  getAllMessages,
  sendThisMessage,
};
