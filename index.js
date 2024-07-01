'use strict';

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const config = require('./config/server-config.js');
const { mailsender } = require('./config/email-config.js');
const { PORT, MAIL_EMAIL } = config;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mailsender.sendMail({
        from: MAIL_EMAIL,
        to: 'ankit.123patnaik123@gmail.com',
        subject: 'subject',
        text: 'content' 
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
});
