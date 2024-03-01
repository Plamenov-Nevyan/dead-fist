const {Client} = require("pg")
const { user, host, database, password, port } = require("./dbConfig");
console.log(
  user, 
  password
)
 
const client = new Client({
  user,
  host,
  database,
  password,
  port,
});
 
// client.connect();

module.exports = client;