require('dotenv').config()

module.exports = {
  hostname: process.env.DB_HOSTNAME || "localhost",
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "exordium_api"
}
