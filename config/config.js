// read in .env file and make values available to app
require('dotenv').config();
let testDB = process.env.MONGO_TEST_URL;
let prodDB = process.env.MONGO_CONNECTION_URL;

module.exports = {
    PORT: process.env.PORT,
    MONGO_CONNECTION_URL: prodDB,
    TOKEN_SECRET: process.env.TOKEN_SECRET
}