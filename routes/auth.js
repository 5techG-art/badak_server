const {register, login} = require('../controller/auth');
// const login = require('../controller/auth');
const express = require('express');
const verifyToken = require('../middleware/tokenVerify');
const router = express.Router();

// update user
router.post("/new-user/register", verifyToken , register);
router.post("/registered-user/login" , login);


module.exports = router;