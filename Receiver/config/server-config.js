'use strict';


const dotenv = require('dotenv');
dotenv.config();

const config = {
    PORT: process.env.PORT,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_EMAIL: process.env.MAIL_EMAIL
};

module.exports = config;
