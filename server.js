const app = require('./app');

// const Server = require('./server/index');

// const chatServer = new Server(app.io);
// console.log(chatServer);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
