const cors = require("cors");
const express = require("express");
const expressConfig = require("./config/expressConfig.js");
const keyConstants = require("./config/constants.js");
const routes = require('./routes.js')

const app = express();
expressConfig(app);
app.use(cors());
app.use(routes)

app.listen(keyConstants.SERVER_PORT, () => {
    console.log(`Server is running at http://localhost:${keyConstants.SERVER_PORT}`);
  });