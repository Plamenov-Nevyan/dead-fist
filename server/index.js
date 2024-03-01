const cors = require("cors");
const express = require("express");
const expressConfig = require("./config/expressConfig.js");
const keyConstants = require("./config/constants.js");
const routes = require('./routes.js')
const { client, connectToDatabase } = require('./config/db.js');

connectToDatabase()
const app = express();
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