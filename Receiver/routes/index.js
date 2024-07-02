const express = require('express')
const { MailController } = require('../controllers/index')

const router = express.Router();

router.post('/tickets', MailController.createMail);

module.exports = router