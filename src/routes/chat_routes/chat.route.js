const express = require('express');
const router = express.Router();

const chat_controller = require('./chat.controller')
const auth = require('../../middleware/auth');

router.post('/createPrivateChat',auth, chat_controller.createPrivateChat);
router.post('/createGroupChat',auth, chat_controller.createGroupChat);
router.get('/myChats',auth, chat_controller.myChats);

module.exports = router