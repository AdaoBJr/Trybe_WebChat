const rescue = require('express-rescue');
const Model = require('../models/messageModel');

const getAll = rescue(async (_req, res) => {
  const messages = await Model.getAll();
  return res.status(200).json(messages);
});

module.exports = {
  getAll,
};