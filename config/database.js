const mysql = require('mysql2');
const dotenv = require('dotenv')
dotenv.config()

// Connection configuration for MySQL database
const db = mysql.createPool({
//   remote database credentials
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.CONNECTIONLIMIT,
  charset: process.env.CHARSET

  // local database credentials
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "car_repo",
//   connectionLimit: 20,
//   charset: "utf8mb4"
});

module.exports = db;
