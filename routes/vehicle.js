const { adminConfirmVehicle, deleteBranchVehicle, userConfirmVehicle, deleteVehicleById, deleteVehicleByRcNumber, vehicleWithLimit, vehicleSearchByRcNumber, vehicleSearchByChassisNumber, vehicleDetails, confirmVehicleWithLimit, confirmVehicleSearchWithChassisNumber, confirmVehicleSearchWithRcNumber, confirmVehicleDetailsWithImage, adminRejectVehicle } = require('../controller/vehicle');
const verifyToken = require('../middleware/tokenVerify');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

class mySqlApi {
  // method to execute a query and return the result via a Promise
  executeQuery(query) {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          // if there's an error connecting to the database, reject the Promise with the error
          reject(err);
        }

        try {
          // execute the query
          connection.query(query, function (err, result) {
            connection.release();
            if (err) reject(err);
            else resolve(result);
          });
        } catch (err) {
          console.log("mysqlApi executeQuery error: ", err);
        }
      });
    });
  }
}
const mySqlApis = new mySqlApi();
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
router.post("/upload/data", (req, res) => {
  // console.log(req);
  mySqlApis
    .executeQuery(req.body.query)
    .then((result) => {
      console.log("success");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("error: ", err);
      res.status(500).json(err);
    });
});

module.exports = router;