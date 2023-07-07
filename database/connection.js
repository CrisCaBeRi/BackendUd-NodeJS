//! Conexión a la bd
const MYSQL = require("mysql");

const CONNECTION = MYSQL.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "hospitalud",
  charset: "utf8mb4",
});

CONNECTION.connect((error) => {
  if (error) {
    console.log("Error al conectar con la BD: ", error);
  }
});

module.exports = { CONNECTION };
