const moment = require('moment'); // Biblioteca para formato de datas/horas
const { save } = require('./models/webChat');

const create = (chatMessage, nickname) => {
  const time = moment().format('DD-MM-YYYY HH:mm:ss A');
  save({ message: chatMessage, nickname, time });
  const mensagem = `${time} - ${nickname}: ${chatMessage}`;
  return mensagem;
};

module.exports = { create };
