const express = require('express');
const router = express.Router();

const post_controller = require('./post.controller')
const uploadMiddleWare = require('../../middleware/fileUpload');
const auth = require('../../middleware/auth');

router.post('/createPost',auth, uploadMiddleWare.array('file', 5), post_controller.createPost);
router.get('/allPost', auth, post_controller.allPosts);
router.post('/fileUpload', uploadMiddleWare.single('file'), post_controller.fileUpload);


module.exports = router