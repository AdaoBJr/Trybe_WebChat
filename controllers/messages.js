const messageModel = require('../models/messages');
// O formato da mensagem deve seguir esse padrão:
const formatoData = (date) => {
  const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
// Tratamento do resultado
const AMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; 
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return strTime;
};

const newDate = () => {
  const date = new Date();
  const now = `${formatoData(date)} ${AMPM(date)}`;
  return now;
};

const sendMessage = async (message, nickname, now) => messageModel
  .sendMessage(message, nickname, now);

const getAllMessages = async () => messageModel.getAllMessages();

module.exports = {
  sendMessage,
  getAllMessages,
  newDate,
};
