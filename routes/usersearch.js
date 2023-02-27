
const express = require('express');
const { allUserSearchFilterByDate } = require('../controller/usersearch');
const verifyToken = require('../middleware/tokenVerify');
const router = express.Router();

// update user
// router.post("/details/user", verifyToken, allUserSearch);
router.post("/details/filter/Date", verifyToken, allUserSearchFilterByDate);


module.exports = router;