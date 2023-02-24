const db = require("../config/database");
const createError = require("../error");

const vehicleRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_vehicle FROM vehicle`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        });
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const branchRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_branch FROM branch`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const financeRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_finance FROM finance`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const userRequestRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_userRequest FROM userrequest WHERE accept = 0`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const adminRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_admin FROM admin`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const userRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_user FROM users`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const userActiveRecords = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT COUNT(*) as total_activeUser FROM users WHERE is_active=1`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    res.status(200).json({ success: true, data: result1[0] })
                })
            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

module.exports = { vehicleRecords, financeRecords, branchRecords, userRequestRecords, adminRecords, userRecords, userActiveRecords }