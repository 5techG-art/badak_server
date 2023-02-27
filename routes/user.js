
const express = require('express');
const verifyToken = require('../middleware/tokenVerify');
const { allUser, userSignInRequest, allRequestUser, acceptUserRequest, rejectUserRequest, acceptRejectUserRequest, userFinanceAllocate, UserById, deleteUserByUserId, updateUserPlanByUserId, updateUserDetailsByUserId } = require('../controller/user');
const router = express.Router();

// update user
router.post("/all/user", verifyToken, allUser);
router.post("/new/user/register", userSignInRequest);
router.post("/request/all/user", verifyToken, allRequestUser);
router.put("/accept/user/:request_id", verifyToken, acceptUserRequest);
router.put("/accept/cancel/user/:request_id", verifyToken, acceptRejectUserRequest);
router.delete("/reject/user/:request_id", verifyToken, rejectUserRequest);
router.put("/finance/access/user/:userId", verifyToken, userFinanceAllocate);
router.delete("/delete/user/:userId", verifyToken, deleteUserByUserId);
router.post("/details/user/:userId", verifyToken, UserById);
router.put("/update/plan/:userId", verifyToken, updateUserPlanByUserId);
router.put("/update/details/:userId", verifyToken, updateUserDetailsByUserId);


module.exports = router;