const db = require("../config/database");
const createError = require("../error");
const { v4: uuid } = require("uuid")

const allFinance = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM finance`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        next(createError(404, "Finance not created"))
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



const newFinance = async (req, res, next) => {
    const { name, email, address, mobile1, mobile2 } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                const financeId = await uuid()
                db.query(`INSERT INTO finance (id, name, email, address, mobile1, mobile2) VALUES ('${financeId}', '${name}', '${email}', '${address}', '${mobile1}', '${mobile2}')`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, "This email or mobile number already exist")))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`SELECT * FROM finance WHERE id='${financeId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.length > 0) {
                                res.status(200).json({ success: true, data: result2 })
                            } else {
                                next(createError(404, "Account has not created"))
                            }
                        })
                    } else {
                        next(createError(404, "Account has not created"))
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



const updateFinance = async (req, res, next) => {
    const { name, email, address, mobile1, mobile2 } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`UPDATE finance SET name = '${name}', email = '${email}', address = '${address}', mobile1 =  '${mobile1}', mobile2 =  '${mobile2}' WHERE id = '${req.params.financeId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0)
                        res.status(200).json({ success: true, message: "Successfully updated" })
                })

            } else {
                res.status(404).json({ success: false, message: "You are not valid admin" })
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const deleteFinance = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`DELETE FROM finance WHERE id = '${req.params.financeId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`DELETE FROM branch WHERE finance_id = '${req.params.financeId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.affectedRows > 0) {
                                db.query(`DELETE FROM vehicle WHERE finance_id = '${req.params.financeId}'`, async function (err, result3) {
                                    if (err) {
                                        return next((createError(404, err.message)))
                                    }
                                    res.status(200).json({ success: true, message: "Successfully deleted" })
                                })
                            } else {
                                res.status(200).json({ success: true, message: "Successfully deleted" })
                            }
                        })
                    } else {
                        res.status(200).json({ success: true, message: "Successfully deleted" })
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


module.exports = { allFinance, newFinance, updateFinance, deleteFinance }