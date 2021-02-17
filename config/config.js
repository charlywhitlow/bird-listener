// read in .env file and make values available to app
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL,
    MONGO_TEST_URL: process.env.MONGO_TEST_URL,
    TOKEN_SECRET: process.env.TOKEN_SECRET
}