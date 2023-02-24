const mysql = require('mysql2');
const dotenv = require('dotenv')
dotenv.config()

// Connection configuration for MySQL database
const db = mysql.createPool({
  // remote database credentials
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.CONNECTIONLIMIT,
  charset: process.env.CHARSET

  // local database credentials
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "car_repo",
  // connectionLimit: 20,
  // charset: "utf8mb4"


  // local database credentials
  // host: "car-repo.c2kjutp1a5hu.ap-south-1.rds.amazonaws.com",
  // user: "car_repo",
  // password: "Carrepo123",
  // database: "car-repo",
  // connectionLimit: 20


  // remote database credentials
  // host: "localhost",
  // user: "ubzrnkmd_carrepoadmin",
  // password: "carrepo@123",
  // database: "ubzrnkmd_car_repo",
  // connectionLimit: 500
});

module.exports = db;