const messagesModel = require('../models/messagesModel');

const getAllMessages = async (_req, res) => {
  try {
    const messages = await messagesModel.getAllMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Ops, something went wrong! :(' });
  }
};

const addMessage = async (req, res) => {
  try {
    const { nickname, message } = req.body;
    const timestamp = new Date().toLocaleString().replace(/\//g, '-');
    
    await messagesModel.addMessage({ message, nickname, timestamp });
    res.status(201).json({ message: 'Message delivered!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Ops, something went wrong! :(' });
  }
};

module.exports = {
  getAllMessages,
  addMessage,
};
