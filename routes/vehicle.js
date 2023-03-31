const { adminConfirmVehicle, deleteBranchVehicle, userConfirmVehicle, deleteVehicleById, deleteVehicleByRcNumber, vehicleWithLimit, vehicleSearchByRcNumber, vehicleSearchByChassisNumber, vehicleDetails, confirmVehicleWithLimit, confirmVehicleSearchWithChassisNumber, confirmVehicleSearchWithRcNumber, confirmVehicleDetailsWithImage, adminRejectVehicle, uploadExcelFileData } = require('../controller/vehicle');
const verifyToken = require('../middleware/tokenVerify');
const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')


// uploads check points
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log(file);
    callback(null, './public/uploads');
  },
  filename: (req, file, callback) => {
    // console.log(file);
    callback(null, file.fieldname + "-" + Date.now() + Math.floor(Math.random() * 10000) + path.extname(file.originalname) + '.csv');
  },
});


const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024, },
  fileFilter: (req, file, callback) => {
    // const allowedFileTypes = ['image/jpeg', 'image/png'];
    // if (!allowedFileTypes.includes(file.mimetype)) {
    //     return callback(new Error('Invalid file type'));
    // }
    callback(null, true);
  },
});
// update user
// router.get("/user/confirm/:rc_number", verifyToken, update);
router.post("/admin/confirm/:vehicleId", verifyToken, adminConfirmVehicle);
router.post("/admin/all/vehicle", verifyToken, vehicleWithLimit);
router.post("/admin/find/vehicle/rc-number", verifyToken, vehicleSearchByRcNumber);
router.post("/admin/find/vehicle/chassis-number", verifyToken, vehicleSearchByChassisNumber);
router.post("/admin/details/vehicle", verifyToken, vehicleDetails);
router.delete("/delete/branch/:branchId", verifyToken, deleteBranchVehicle);
router.post("/all/confirm/vehicle", verifyToken, userConfirmVehicle);
router.post("/delete/vehicle/vehicle-id", verifyToken, deleteVehicleById);
router.post("/delete/vehicle/rc-number/:rc_number", verifyToken, deleteVehicleByRcNumber);
router.post("/confirm/vehicle/list", verifyToken, confirmVehicleWithLimit);
router.post("/confirm/vehicle/search/rc-number/:rc_number", verifyToken, confirmVehicleSearchWithRcNumber);
router.post("/confirm/vehicle/search/chassis-number/:rc_number", verifyToken, confirmVehicleSearchWithChassisNumber);
router.post("/confirm/vehicle/data/image/:vehicleId", verifyToken, confirmVehicleDetailsWithImage);
// router.post("/upload/data", vehicleDataUpload);
router.post("/upload", upload.single('file'), uploadExcelFileData);

module.exports = router;