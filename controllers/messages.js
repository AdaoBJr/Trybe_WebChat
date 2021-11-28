const express = require('express');

const router = express.Router();

const messageModel = require('../models/messages');
// O formato da mensagem deve seguir esse padrão:
const getFormatedDate = (date) => {
  const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const hoursToAmPm = (hours) => {
  let result = hours;
  result %= 12;
  result = result || 12;
  result = result < 10 ? `0${result}` : result;
  return result;
};

// Tratamento do resultado
const getAMPM = (date) => {
  const hours = hoursToAmPm(date.getHours());
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  const strTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return strTime;
};

const newDate = () => {
  const date = new Date();
  const now = `${getFormatedDate(date)} ${getAMPM(date)}`;
  return now;
};

const sendMessage = async (message, nickname, now) => messageModel
  .sendMessage(message, nickname, now);

const getAllMessages = async () => messageModel.getAllMessages();

router.get('/', async (req, res) => {
  const messages = await messageModel.getAllMessages();
  res.status(200).json(messages);
});

module.exports = {
  sendMessage,
  getAllMessages,
  newDate,
  router,
};
