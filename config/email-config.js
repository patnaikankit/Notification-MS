'use strict';

const nodemailer = require('nodemailer');
const { MAIL_PASS, MAIL_EMAIL } = require('./server-config.js');

const mailsender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_EMAIL,
        pass: MAIL_PASS
    }
});

module.exports = {
    mailsender
};
