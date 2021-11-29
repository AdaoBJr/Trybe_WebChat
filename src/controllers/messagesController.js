const messagesModel = require('../models/messagesModel');

const getAllMessages = async (req, res) => {
  try {
    const messages = await messagesModel.getAllMessages();

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong :(' });
  }
};

const addMessage = async (req, res) => {
  try {
    const { nickname, message } = req.body;
    const now = new Date().toLocaleString().replace(/\//g, '-');
    
    await messagesModel.addMessage(message, nickname, now);

    res.status(201).json({ message: 'message createad' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong :(' });
  }
};

module.exports = {
  getAllMessages,
  addMessage,
};
