const { Router } = require('express');
const { saveMessageModel, getAllMessages } = require('../models/chatModel');

const chatController = Router();

chatController.get('/', (_req, res) => {
  res.render('chat');
});

module.exports = {
  chatController,
  saveMessageModel,
  getAllMessages,
};