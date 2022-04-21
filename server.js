const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

sequelize.sync().then(() => {
  console.log('\nSequelize models synced to MySQL!')
  app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
});
