const moment = require('moment'); // Biblioteca para formato de datas/horas

const create = (chatMessage, nickname) => {
  const mensagem = `${moment().format(
    'DD-MM-YYYY HH:mm:ss A',
  )} - ${nickname}: ${chatMessage}`;
  return mensagem;
};

module.exports = { create };
