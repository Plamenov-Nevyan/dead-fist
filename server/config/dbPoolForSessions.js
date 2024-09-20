const pg = require("pg");
const dbProps = require("./dbConfig.js");

module.exports = () => {
  const pgPool = new pg.Pool({
    ...dbProps,
  });
  return pgPool;
};
