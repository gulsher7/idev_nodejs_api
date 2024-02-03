const express = require('express');
const router = express.Router();

const user_controller = require('./user.controller')

router.post('/signup', user_controller.createUser);
router.post('/login', user_controller.loginUser);
router.post('/otpVerify', user_controller.otpVerify);
router.get('/fetchUsers', user_controller.fetchAllUsers);
router.get('/fetchUserDetails', user_controller.fetchUserDetails);


module.exports = router