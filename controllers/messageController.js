const message = require('../models/messageModel');

const getChat = async (req, res) => {
  const AllMessages = await message.getMessages();

  res.render('chat', { AllMessages });
};

const addMessage = async (req, res) => {
  const { id } = req.body;
  const author = await message.findById(id);

  if (!author) return res.status(404).render('404');

  res.status(200).render('authors/show', { author });
};

module.exports = {
  getChat,
  addMessage, 
};