const db = require("../config/database");
const createError = require("../error");
const { v4: uuid } = require("uuid")

const userSignInRequest = async (req, res, next) => {
    const { name, email, address, mobile } = req.body
    try {
        db.query(`SELECT mobile, email FROM userrequest WHERE mobile='${mobile}' OR email='${email}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                return next((createError(400, "This email or mobile number is already exists")))
            } else {
                let request_id = await uuid()
                db.query(`INSERT INTO userrequest(name, email, address, mobile, request_id) VALUES ('${name}','${email}','${address}','${mobile}', '${request_id}')`, async function (err, result) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result.affectedRows > 0)
                        res.status(200).json({ success: true, data: result })
                    else
                        res.status(200).json({ success: false, data: "User is not created" })
                })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const allUser = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {

                db.query(`SELECT * FROM users INNER JOIN userrequest ON userrequest.request_id = users.user_id`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found", data: result1 })
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

const UserById = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {

                db.query(`SELECT * FROM users INNER JOIN userrequest ON userrequest.request_id = users.user_id WHERE users.user_id = '${req.params.userId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found", data: result1 })
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




const allRequestUser = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM userrequest WHERE accept = 0`, async function (err, result1) {
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




const acceptUserRequest = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE userrequest SET accept = 1 WHERE request_id = '${req.params.request_id}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`INSERT INTO users (name, email, address, mobile, user_id) SELECT name, email, address, mobile, request_id FROM userrequest WHERE request_id = '${req.params.request_id}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.affectedRows > 0) {
                                db.query(`SELECT * FROM users INNER JOIN userrequest ON userrequest.request_id = users.user_id WHERE users.user_id = '${req.params.request_id}'`, async function (err, result3) {
                                    if (err) {
                                        next(createError(404, err.message))
                                    }
                                    res.status(200).json({ success: true, data: result3 })
                                })
                            } else {
                                res.status(200).json({ success: true, message: "Already accept" })
                            }
                        })
                    } else {
                        return next(createError(400, "User not found"))
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



const rejectUserRequest = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE userrequest SET accept = 2 WHERE request_id = '${req.params.request_id}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`INSERT INTO rejectuser (name, email, address, mobile, request_id, kyc_image, image, dra_image, kyc_type) SELECT name, email, address, mobile, request_id, kyc_image, image, dra_image, kyc_type FROM userrequest WHERE request_id = '${req.params.request_id}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, "This user already exists")))
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



const acceptRejectUserRequest = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE userrequest SET accept = 1 WHERE id = '${req.params.request_id}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT request_id FROM userrequest WHERE id = '${req.params.request_id}'`, function (err, result3) {
                            if (err) {
                                next(createError(404, err.message))
                            }
                            if (result3.length > 0) {
                                db.query(`DELETE FROM rejectuser WHERE request_id = '${result3[0].request_id}'`, async function (err, result1) {
                                    if (err) {
                                        return next((createError(404, err.message)))
                                    }
                                    if (result1.affectedRows > 0) {
                                        db.query(`INSERT INTO users (name, email, address, mobile1, user_id, image, kyc_image, dra_image, kyc_type) SELECT name, email, address, mobile, request_id, image, kyc_image, dra_image, kyc_type FROM userrequest WHERE request_id = '${result3[0].request_id}'`, async function (err, result2) {
                                            if (err) {
                                                return next((createError(404, err.message)))
                                            }
                                            if (result2.affectedRows > 0) {
                                                res.status(200).json({ success: true, data: result2 })
                                            } else {
                                                next(createError(404, "User already confirmed"))
                                            }
                                        })
                                    } else {
                                        next(createError(404, "User already confirmed"))
                                    }
                                })
                            } else {
                                next(createError(404, "User already  confirmed"))
                            }
                        })
                    } else {
                        next(createError(404, "User already confirmed"))
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


const userFinanceAllocate = (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, function (err, result) {
            if (err) {
                next(createError(404, err.message))
            }
            if (result.length > 0) {
                db.query(`SELECT finance_id FROM users WHERE user_id='${req.params.userId}'`, function (err, result1) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    const financeIds = result1[0].finance_id.split(",");
                    const exists = financeIds.includes(req.body.finance_id);

                    // Update the finance ID for the user
                    if (exists) {
                        db.query(`UPDATE users SET finance_id = REPLACE(finance_id, ',${req.body.finance_id}', '') WHERE user_id = '${req.params.userId}'`, function (err, updateResult) {
                            if (err) {
                                return next(createError(500, err.message));
                            }
                            res.status(200).json({ success: true, data: updateResult });
                        });
                    } else {
                        db.query(`UPDATE users SET finance_id = CONCAT(',${req.body.finance_id}',finance_id) WHERE user_id = '${req.params.userId}'`, function (err, updateResult) {
                            if (err) {
                                return next(createError(500, err.message));
                            }
                            res.status(200).json({ success: true, data: updateResult });
                        });
                    }
                })
            } else {
                next(404, "Sorry you are not admin")
            }
        })
    } catch (error) {
        console.log(error);
    }
}


const deleteUserByUserId = (req, res) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, function (err, result) {
            if (err) {
                next(createError(404, err.message))
            }
            if (result.length > 0) {
                db.query(`DELETE FROM users WHERE user_id='${req.params.userId}'`, function (err, result1) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`DELETE FROM userrequest WHERE request_id='${req.params.userId}'`, function (err, result2) {
                            if (err) {
                                next(createError(404, err.message))
                            }
                            if (result2.affectedRows > 0) {
                                res.status(200).json({ success: true, message: "SuccessFully deleted" })
                            } else {
                                res.status(200).json({ success: true, message: "Already data deleted" })
                            }
                        })
                    } else {
                        res.status(200).json({ success: true, message: "Already data deleted" })
                    }
                })
            } else {
                next(404, "Sorry you are not admin")
            }
        })
    } catch (error) {

    }
}



function serverDateFormat(dateFormat) {

    // Create a new Date object from the ISO 8601 formatted date string
    const date = new Date(dateFormat);

    // Extract the day, month, and year components from the Date object
    const day = ('0' + (date.getUTCDate())).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // month is zero-indexed, so add 1 to get the correct value
    const year = date.getUTCFullYear();

    // Format the day, month, and year components into the desired string format
    const formattedDateString = `${year}-${month}-${day}`;

    // return the formatted date string
    return formattedDateString;
}


const updateUserPlanByUserId = (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                next(createError(404, err.message))
            }
            if (result.length > 0) {
                const newDate = new Date()
                const access_from = await serverDateFormat(newDate)
                db.query(`UPDATE users SET access_to = '${req.body.updateDate}', access_from = '${access_from}' WHERE user_id='${req.params.userId}'`, function (err, result1) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    console.log(result1);
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT * FROM users WHERE user_id = '${req.params.userId}'`, async function (err, result2) {
                            if (err) {
                                next(createError(404, err.message))
                            }
                            res.status(200).json({ success: true, data: result2 })
                        })
                    } else {
                        res.status(200).json({ success: true, message: "Already plan update" })
                    }
                })
            } else {
                next(createError(404, "Sorry you are not admin"))
            }
        })
    } catch (error) {

    }
}

const updateUserDetailsByUserId = (req, res) => {
    const { name, email, address, mobile, balance, is_active } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                next(createError(404, err.message))
            }
            if (result.length > 0) {
                db.query(`UPDATE users SET name = '${name}', email= '${email}', address= '${address}', mobile= '${mobile}', balance= '${balance}', is_active= '${is_active}' WHERE user_id='${req.params.userId}'`, function (err, result1) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    db.query(`UPDATE userrequest SET name = '${name}', email= '${email}', address= '${address}', mobile= '${mobile}' WHERE request_id='${req.params.userId}'`, function (err, result2) {
                        if (err) {
                            next(createError(404, err.message))
                        }
                        if (result2.affectedRows > 0) {
                            db.query(`SELECT * FROM users INNER JOIN userrequest ON userrequest.request_id = users.user_id WHERE users.user_id = '${req.params.userId}'`, async function (err, result3) {
                                if (err) {
                                    next(createError(404, err.message))
                                }
                                res.status(200).json({ success: true, message: "Successfully updated", data: result3 })
                            })
                        } else {
                            res.status(200).json({ success: true, message: "Already user update" })
                        }
                    })
                })
            } else {
                next(createError(404, "Sorry you are not admin"))
            }
        })
    } catch (error) {

    }
}

module.exports = { allUser, userSignInRequest, allRequestUser, acceptUserRequest, rejectUserRequest, UserById, acceptRejectUserRequest, userFinanceAllocate, deleteUserByUserId, updateUserPlanByUserId, updateUserDetailsByUserId }