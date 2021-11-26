const connection = require('../models/connection');

const chat = async (req, res) => {
  const messages = await connection().then(
    (db) => db.collection('messages').find({}).toArray(),
  );

  // helped by Gustavo's PR: https://github.com/tryber/sd-010-b-project-webchat/blob/gmcerqueira/server.js
  res.status(200).render('index.ejs', { messages });
};

module.exports = {
  chat,
};
