const db = require("../config/database");
const createError = require("../error");
const { v4: uuid } = require("uuid")

const allBranch = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM branch`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1 })
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const newBranch = async (req, res, next) => {
    const { name, email, address, mobile1, mobile2 } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                const branchId = await uuid()
                db.query(`INSERT INTO branch (id, name, email, address, mobile1, mobile2, finance_id) VALUES ('${branchId}', '${name}', '${email}', '${address}', '${mobile1}', '${mobile2}', '${req.params.financeId}')`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, "This email or mobile number already exist")))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT * FROM branch WHERE id='${branchId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, "Internal server error")))
                            }
                            res.status(200).json({ success: true, data: result2 })
                        })
                    }
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const updateBranch = async (req, res, next) => {
    const { name, email, address, mobile1, mobile2 } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE branch SET name = '${name}', email = '${email}', address = '${address}', mobile1 =  '${mobile1}', mobile2 =  '${mobile2}' WHERE id = '${req.params.branchId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT * FROM branch WHERE id = '${req.params.branchId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.length > 0) {
                                res.status(200).json({ success: true, message: "Successfully updated", data: result2 })
                            }
                            else {
                                next(createError(404, "Data not Updated"))
                            }
                        })
                    } else {
                        next(createError(404, "Data not Updated"))
                    }
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const deleteBranch = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`DELETE FROM branch WHERE id = '${req.params.branchId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`DELETE FROM vehicle WHERE branch_code = '${req.params.branchId}'`, function (err, result2) {
                            if (err) {
                                next(createError(404, err.message))
                            }
                            res.status(200).json({ success: true, message: "Successfully Deleted", data: result2 })
                        })
                    } else {
                        res.status(200).json({ success: true, message: "Branch already deleted" })
                    }
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}


const updateBranchRecord = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT total_record FROM branch WHERE id = '${req.params.branchId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    console.log(result1[0].total_record + req.body.record);
                    if (result1.length > 0) {
                        db.query(`UPDATE branch SET total_record = '${result1[0].total_record + req.body.record}' WHERE id = '${req.params.branchId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.affectedRows > 0) {
                                res.status(200).json({ success: true, data: result2 })
                            }

                        })
                    }

                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const allBranchHeader = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM branchheader`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1 })
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

const excelDataHeader = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM exceldataheader`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1 })
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const DeleteBranchRecord = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE branch SET total_record = 0 WHERE id = '${req.params.branchId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT total_record FROM branch WHERE id = '${req.params.branchId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.length > 0) {
                                res.status(200).json({ success: true, data: result2 })
                            }

                        })
                    } else {
                        next(createError(404, "Records already deleted"))
                    }

                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

module.exports = { allBranch, newBranch, updateBranch, deleteBranch, updateBranchRecord, allBranchHeader, excelDataHeader, DeleteBranchRecord }