const verifyToken = require('../middleware/tokenVerify');
const express = require('express');
const { vehicleRecords, financeRecords, branchRecords, userRequestRecords, adminRecords, userRecords, userActiveRecords } = require('../controller/records');
const router = express.Router();

// update user
router.post("/all/vehicle", verifyToken, vehicleRecords);
router.post("/all/branch", verifyToken, branchRecords);
router.post("/all/finance", verifyToken, financeRecords);
router.post("/all/user-request", verifyToken, userRequestRecords);
router.post("/all/admin", verifyToken, adminRecords);
router.post("/all/user", verifyToken, userRecords);
router.post("/all/active-user", verifyToken, userActiveRecords);
router.post("/all/confirm-user-request", verifyToken, userActiveRecords);


module.exports = router;