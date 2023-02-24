const { allFinance, newFinance, updateFinance, deleteFinance } = require('../controller/finance');
const verifyToken = require('../middleware/tokenVerify');
const express = require('express')
const router = express.Router();

// update user
// router.get("/user/confirm/:rc_number", verifyToken, update);
router.post("/all", verifyToken, allFinance);
router.post("/create/new", verifyToken, newFinance);
router.put("/update/:financeId", verifyToken, updateFinance);
router.delete("/delete/:financeId", verifyToken, deleteFinance);


module.exports = router;