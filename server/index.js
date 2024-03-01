const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const express = require("express");
const expressConfig = require("./config/expressConfig.js");
const keyConstants = require("./config/constants.js");
const routes = require('./routes.js')
const { client, connectToDatabase } = require('./config/db.js');
const session = require('express-session')
const {redisClient, redisStore} = require('./config/redis.js')()
connectToDatabase()
const app = express();
app.use(session({
  store: redisStore,
  secret: 'placeholder',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  },
  genid: () => {
    uuidv4()
  }
}));
expressConfig(app);
app.use(cors());
app.use(routes)

app.listen(keyConstants.SERVER_PORT, () => {
    console.log(`Server is running at http://localhost:${keyConstants.SERVER_PORT}`);
  });

process.on('exit', async () => {
    try {
        await client.end();
        console.log('Disconnected from the database');
    } catch (err) {
        console.error('Error disconnecting from the database:', err);
    }
});