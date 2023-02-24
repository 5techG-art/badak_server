const express = require('express');
const { allBranch, deleteBranch, updateBranch, newBranch, updateBranchRecord, newBranchHeader, allBranchHeader, excelDataHeader, DeleteBranchRecord } = require('../controller/branch');
const verifyToken = require('../middleware/tokenVerify');
const db = require('../config/database')
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
router.post("/all", verifyToken, allBranch);
router.post("/create/new/:financeId", verifyToken, newBranch);
router.delete("/delete/:branchId", verifyToken, deleteBranch);
router.put("/update/:branchId", verifyToken, updateBranch);
router.post("/update/branch-record/:branchId", verifyToken, updateBranchRecord);
router.delete("/delete/branch-record/:branchId", verifyToken, DeleteBranchRecord);
router.post("/all/branch/header", verifyToken, allBranchHeader);
router.post("/all/branch/excel/header", verifyToken, excelDataHeader);
router.post("/insert/branch-header", (req, res) => {
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
})


module.exports = router;