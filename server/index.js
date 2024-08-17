const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const express = require("express");
const expressConfig = require("./config/expressConfig.js");
const keyConstants = require("./config/constants.js");
const routes = require('./routes.js')
const { client, connectToDatabase } = require('./config/db.js');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const pgPool = require('./config/dbPoolForSessions.js')()

  connectToDatabase().then(() => {
    const app = express();

    app.use(cors({
      origin:'http://localhost:3000',
      credentials: true,
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    }));

    app.use(session({
      store: new pgSession({
        pool: pgPool,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: 'placeholder',
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        maxAge: 1000 * 60 * 60,
        secure: false,
        sameSite: 'lax'
      },
      genid: () => {
        return uuidv4()
      }
    }));
    expressConfig(app);

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
  }).catch(err => console.log(err))
  