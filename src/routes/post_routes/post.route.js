const express = require('express');
const router = express.Router();

const post_controller = require('./post.controller')
const uploadMiddleWare = require('../../middleware/fileUpload');
const auth = require('../../middleware/auth');

router.post('/createPost',auth, uploadMiddleWare, post_controller.createPost)
router.get('/allPost', auth, post_controller.allPosts)


module.exports = router