const { adminConfirmVehicle, deleteBranchVehicle, userConfirmVehicle, deleteVehicleById, deleteVehicleByRcNumber, vehicleWithLimit, vehicleSearchByRcNumber, vehicleSearchByChassisNumber, vehicleDetails } = require('../controller/vehicle');
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
router.put("/admin/confirm/:rc_number", verifyToken, adminConfirmVehicle);
router.post("/admin/all/vehicle", verifyToken, vehicleWithLimit);
router.post("/admin/find/vehicle/rc-number", verifyToken, vehicleSearchByRcNumber);
router.post("/admin/find/vehicle/chassis-number", verifyToken, vehicleSearchByChassisNumber);
router.post("/admin/details/vehicle", verifyToken, vehicleDetails);
router.delete("/delete/branch/:branchId", verifyToken, deleteBranchVehicle);
router.post("/all/confirm/vehicle", verifyToken, userConfirmVehicle);
router.post("/delete/vehicle/vehicle-id", verifyToken, deleteVehicleById);
router.post("/delete/vehicle/rc-number/:rc_number", verifyToken, deleteVehicleByRcNumber);
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