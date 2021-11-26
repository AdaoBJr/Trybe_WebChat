const app = require('./app');

const PORT = process.env.PORT || 8080;

app.express.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
