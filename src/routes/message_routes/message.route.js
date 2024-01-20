const express = require('express');
const router = express.Router();

const message_controller = require('./message.controller')
const auth = require('../../middleware/auth');

router.post('/sendMessage',auth, message_controller.sendMessage)
router.get('/myMessages',auth, message_controller.myMessages)

module.exports = router