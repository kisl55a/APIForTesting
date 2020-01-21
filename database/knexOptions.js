require("dotenv").config();

module.exports = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    // password: "root",
    port: 3306,
    database: "weatherAPI",
    pool: {
      min: 2,
      max: 10
  }
  }
};
