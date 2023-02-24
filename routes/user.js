
const express = require('express');
const verifyToken = require('../middleware/tokenVerify');
const { allUser, userSignInRequest, allRequestUser, acceptUserRequest, rejectUserRequest, acceptRejectUserRequest } = require('../controller/user');
const router = express.Router();

// update user
router.post("/all/user", verifyToken, allUser);
router.post("/new/user/register", userSignInRequest);
router.post("/request/all/user", verifyToken, allRequestUser);
router.put("/accept/user/:request_id", verifyToken, acceptUserRequest);
router.put("/accept/cancel/user/:request_id", verifyToken, acceptRejectUserRequest);
router.delete("/reject/user/:request_id", verifyToken, rejectUserRequest);


module.exports = router;