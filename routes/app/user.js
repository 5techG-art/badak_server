
const express = require('express');
const { userSignInRequest, vehicleRecordByUserId, vehicleFindByUserWithRcNumber, vehicleFindByUserWithRcNumberInSearch, confirmVehicleWithUserByChassisNumberAndUserId, confirmVehicleWithUserByRcNumberAndUserId, uploadUserImage, uploadUserKycDocuments, uploadUserDraDocuments, allVehicleRecordByUserId, vehicleFindByUserWithChassisNumberInSearch, vehicleFindByUserWithChassisNumber, uploadVehicleImageByUser, vehicleFindByUserWithVehicleId, confirmVehicleWithUserByVehicleIdAndUserId } = require('../../controller/app/user');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer')
const path = require('path');
const accressMiddleware = require('../../controller/app/accessMiddleware');
const accessMiddleware = require('../../controller/app/accessMiddleware');


// uploads check points
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // console.log(file);
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        // console.log(file);
        callback(null, file.fieldname + "-" + Date.now() + Math.floor(Math.random() * 10000) + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024, },
    fileFilter: (req, file, callback) => {
        const allowedFileTypes = ['image/jpeg', 'image/png'];
        if (!allowedFileTypes.includes(file.mimetype)) {
            return callback(new Error('Invalid file type'));
        }
        callback(null, true);
    },
});




// update user
router.post("/new/app-user", [
    body('mobile').isNumeric().isLength({ min: 10, max: 10 }),
    body('id').notEmpty(),
    body('address').notEmpty()
], userSignInRequest);
router.post("/vehicle/:userId", accessMiddleware, vehicleRecordByUserId);
router.post("/vehicle/all/:userId", accessMiddleware, allVehicleRecordByUserId);
// router.post("/vehicle/rc-number/:userId/:rc_number", accessMiddleware, vehicleFindByUserWithRcNumber);
router.post("/vehicle/vehicle-id/:userId/:vehicleId", accessMiddleware, vehicleFindByUserWithVehicleId);
// router.post("/vehicle/chassis-number/:userId/:rc_number", accessMiddleware, vehicleFindByUserWithChassisNumber);
router.post("/vehicle/find/rc-number/:userId/:rc_number", accessMiddleware, vehicleFindByUserWithRcNumberInSearch);
router.post("/vehicle/find/chassis-number/:userId/:chassis_number", accessMiddleware, vehicleFindByUserWithChassisNumberInSearch);
// router.post("/confirm/rc-number/:userId", accessMiddleware, confirmVehicleWithUserByRcNumberAndUserId);
// router.post("/confirm/chassis-number/:userId", accessMiddleware, confirmVehicleWithUserByChassisNumberAndUserId);
router.post("/confirm/vehicle-id/:userId/:vehicleId", accessMiddleware, confirmVehicleWithUserByVehicleIdAndUserId, upload.array('file', 5), uploadVehicleImageByUser);
router.post("/user/image/upload/:userId", upload.single('file'), uploadUserImage);
router.post("/user/kyc/upload/:userId", upload.single('file'), uploadUserKycDocuments);
router.post("/user/dra/upload/:userId", upload.single('file'), uploadUserDraDocuments);



router.post("/checking/:userId", accressMiddleware);
module.exports = router;