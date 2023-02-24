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
                db.query(`SELECT * FROM users`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    // const withoutPassword = result1.map((user) => {
                    //     let details = [user.password, ...user]
                    //     return details
                    // })
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
                        db.query(`INSERT INTO users (name, email, address, mobile1, user_id, image, kyc_image, dra_image, kyc_type) SELECT name, email, address, mobile, request_id, image, kyc_image, dra_image, kyc_type FROM userrequest WHERE request_id = '${req.params.request_id}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            res.status(200).json({ success: true, data: result2 })
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



module.exports = { allUser, userSignInRequest, allRequestUser, acceptUserRequest, rejectUserRequest, acceptRejectUserRequest }