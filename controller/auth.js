const db = require("../config/database");
const bcrypt = require('bcrypt')
const createError = require("../error");
const jwt = require('jsonwebtoken')
const { v4: uuid } = require("uuid")

const register = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}' AND admin_type=1`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                const { email, name, password, address, type } = req.body
                const admin_id = await uuid()
                const salt = await bcrypt.genSaltSync(10);
                const hash = await bcrypt.hashSync(password, salt)
                db.query(`INSERT INTO admin (admin_email, admin_name, admin_address, admin_id, admin_password, created_by, admin_type) VALUES ('${email}','${name}','${address}','${admin_id}','${hash}','${req.id.admin_id}', ${type})`, function (err, result) {
                    if (err) {
                        return next((createError(404, "This user already exist")))
                    }
                    if (result.affectedRows > 0) {
                        res.status(200).json({ success: true, message: "Successfully created" })
                    }
                    else {
                        next((createError(401, "User not created")))
                    }
                });
            }
            else {
                next((createError(404, "User not created any user because you are not admin")))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_email = '${email}' LIMIT 1`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                const isCorrect = await bcrypt.compare(password, result[0].admin_password)
                if (!isCorrect) return next(createError(400, "Invalid Password"))

                const token = jwt.sign({ admin_id: result[0].admin_id }, process.env.SECRETKEY)
                const { admin_password, ...others } = result[0];

                res.cookie("token", token, {
                    expires: new Date(Date.now() + 36000000),
                    httpOnly: true
                }).status(200).json({ success: true, token: token, data: others })
            }
            else {
                next((createError(404, "This user is not registered")))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

module.exports = { register, login }