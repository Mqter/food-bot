const mysql = require("mysql2");
const { HOST, SQL_USER, PASSWORD } = process.env;
const { logger } = require("./log");

const con = mysql.createConnection({
  host: HOST,
  user: SQL_USER,
  password: PASSWORD,
});

con.connect(function (err) {
  if (err) throw err;
  logger.info("DB connected");
});

module.exports = con;
