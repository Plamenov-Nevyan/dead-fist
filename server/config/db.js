const {Client} = require("pg")
const { user, host, database, password, port } = require("./dbConfig");
 
const client = new Client({
  user,
  host,
  database,
  password,
  port,
});
 
async function connectToDatabase() {
  try {
      await client.connect();
      console.log('Connected to the database');
  } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
  }
}

module.exports = {
  client,
  connectToDatabase
};