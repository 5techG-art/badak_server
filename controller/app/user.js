const db = require("../../config/database");
const createError = require("../../error");
const { v4: uuid } = require("uuid")
const { validationResult } = require('express-validator');



// user sign in request handle
const userSignInRequest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(createError(404, `${errors.array().map(value => {
            return " " + value.param
        })} is required`))
    }
    const { name, address, mobile, id } = req.body
    try {
        let request_id = await uuid()
        db.query(`INSERT INTO userrequest(name, address, mobile, request_id, id) VALUES ('${name}','${address}','${mobile}', '${request_id}', '${id}')`, async function (err, result) {
            if (err) {
                return next((createError(404, "This mobile or id is already in use")))
            }
            if (result.affectedRows > 0)
                res.status(200).json({ success: true, message: "User successfully created" })
            else
                next(createError(404, "User is not created"))
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleRecordByUserId = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            // console.log(result1);
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT rc_number, mek_and_model, chassis_number, chassis_number, vehicle_id FROM vehicle LIMIT 50`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, total: result2.length, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT rc_number, mek_and_model, chassis_number, chassis_number,vehicle_id FROM vehicle WHERE finance_id NOT IN (${outputString}) LIMIT 50`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, total: result2.length, data: result2 });
                    })
                }
            }
            else {
                res.json({ success: false, message: "Record not found" });
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// post request for all rc number & Mek and Model from vehicle table with user id
const allVehicleRecordByUserId = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            // console.log(result1);
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id FROM vehicle`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, total: result2.length, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id FROM vehicle WHERE finance_id NOT IN (${outputString})`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, total: result2.length, data: result2 });
                    })
                }
            }
            else {
                res.json({ success: false, message: "Record not found" });
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithVehicleId = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT * FROM vehicle WHERE vehicle_id = ?`, [req.params.vehicleId], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        const { branch_code, finance_id, is_confirm, is_cancel, ...data } = result2[0]
                        res.json({ success: true, data: data });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT * FROM vehicle WHERE finance_id NOT IN (${outputString}) AND vehicle_id = ?`, [req.params.vehicleId], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        const { branch_code, finance_id, is_confirm, is_cancel, ...data } = result2[0]
                        res.json({ success: true, data: data });
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}

// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithRcNumber = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT * FROM vehicle WHERE rc_number = ?`, [req.params.rc_number], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT * FROM vehicle WHERE finance_id NOT IN (${outputString}) AND rc_number = ?`, [req.params.rc_number], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, data: result2 });
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}


// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithChassisNumber = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT * FROM vehicle WHERE chassis_number = ?`, [req.params.chassis_number], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT * FROM vehicle WHERE finance_id NOT IN (${outputString}) AND chassis_number = ?`, [req.params.chassis_number], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.json({ success: true, data: result2 });
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}







// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithRcNumberInSearch = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id FROM vehicle WHERE rc_number LIKE '%${req.params.rc_number}%'`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.status(200).json({ success: true, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id FROM vehicle WHERE finance_id NOT IN (${outputString}) AND rc_number LIKE '%${req.params.rc_number}%'`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.status(200).json({ success: true, data: result2 });
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}





// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithChassisNumberInSearch = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT chassis_number, mek_and_model,vehicle_id FROM vehicle WHERE chassis_number LIKE '%${req.params.chassis_number}%'`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.status(200).json({ success: true, data: result2 });
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",");
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT chassis_number, mek_and_model,vehicle_id FROM vehicle WHERE finance_id NOT IN (${outputString}) AND chassis_number LIKE '%${req.params.chassis_number}%'`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        res.status(200).json({ success: true, data: result2 });
                    })
                }
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}





// post request for all rc number & Mek and Model from vehicle table with user id
const confirmVehicleWithUserByRcNumberAndUserId = (req, res, next) => {
    try {
        db.query(`SELECT * FROM confirmvehicle WHERE rc_number = '${req.body.rc_number}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                res.status(400).json({ success: false, message: "This vehicle is already confirmed", data: result1 })
            } else {
                db.query(`SELECT name FROM users WHERE user_id = '${result[0].request_id}'`, function (err, result2) {
                    if (err) {
                        return res.json({ success: false, message: err.message });
                    }
                    db.query(`INSERT INTO confirmvehicle (rc_number, user_id, name, chassis_number) VALUES ('${req.body.rc_number}', '${result[0].request_id}', '${result2[0].name}', '${req.body.chassis_number}')`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        if (result2.affectedRows > 0) {
                            res.status(200).json({ success: true, message: "Record successfully confirmed" });
                        } else {
                            return next(createError(404, "Not confirmed"))
                        }
                    })
                })
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}

// post request for all rc number & Mek and Model from vehicle table with user id
const confirmVehicleWithUserByVehicleIdAndUserId = (req, res, next) => {
    try {
        db.query(`SELECT * FROM confirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                next(createError(404, "This vehicle is already confirmed"))
            } else {
                db.query(`SELECT name FROM users WHERE user_id = '${req.id}'`, function (err, result2) {
                    if (err) {
                        return res.json({ success: false, message: err.message });
                    }
                    db.query(`INSERT INTO confirmvehicle (rc_number, user_id, name, chassis_number, vehicle_id) VALUES ('${req.body.rc_number}', '${req.id}', '${result2[0].name}', '${req.body.chassis_number}', '${req.params.vehicleId}')`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        if (result2.affectedRows > 0) {
                            next()
                            // res.status(200).json({ success: true, message: "Record successfully confirmed" });
                        } else {
                            return next(createError(404, "Not confirmed"))
                        }
                    })
                })
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}





// post request for all rc number & Mek and Model from vehicle table with user id
const confirmVehicleWithUserByChassisNumberAndUserId = (req, res, next) => {
    try {
        db.query(`SELECT * FROM confirmvehicle WHERE chassis_number = '${req.body.chassis_number}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                res.status(400).json({ success: false, message: "This vehicle is already confirmed", data: result1 })
            } else {
                db.query(`SELECT name FROM users WHERE user_id = '${req.id}'`, function (err, result2) {
                    if (err) {
                        return res.json({ success: false, message: err.message });
                    }
                    db.query(`INSERT INTO confirmvehicle (rc_number, user_id, name, chassis_number) VALUES ('${req.body.chassis_number}', '${req.id}', '${result2[0].name}', '${req.body.chassis_number}')`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        if (result2.affectedRows > 0) {
                            res.status(200).json({ success: true, message: "Record successfully confirmed" });
                        } else {
                            return next(createError(404, "Not confirmed"))
                        }
                    })
                })
            }
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}



// upload user profile image
const uploadUserImage = (req, res, next) => {
    // console.log(req.file);
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded');
    }
    // console.log(req.file.filename);
    const imgUrl = process.env.IMAGEURL + req.file.filename;
    db.query(`SELECT request_id FROM userrequest WHERE id = '${req.params.userId}'`, async function (err, result) {
        if (err) {
            return next(createError(404, err.message))
        }
        if (result.length > 0) {
            db.query(`UPDATE userrequest SET image = '${imgUrl}' WHERE request_id = '${result[0].request_id}'`, async function (err, result1) {
                if (err) {
                    return next(createError(404, err.message))
                }
                if (result1.affectedRows > 0) {
                    res.status(200).json({ success: true, message: "Profile picture has been successfully uploaded" })
                } else {
                    return next(createError(404, "Profile picture has not uploaded"))
                }
            })
        } else {
            return next(createError(404, "User not created"))
        }
    })
}


// Upload user kyc images
const uploadUserKycDocuments = (req, res, next) => {
    // console.log(req.file);
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded');
    }
    // console.log(req.file.filename);
    const imgUrl = process.env.IMAGEURL + req.file.filename;
    db.query(`SELECT request_id FROM userrequest WHERE id = '${req.params.userId}'`, async function (err, result) {
        if (err) {
            return next(createError(404, err.message))
        }
        if (result.length > 0) {
            db.query(`UPDATE userrequest SET kyc_image = '${imgUrl}', kyc_type = '${req.body.type}' WHERE request_id = '${result[0].request_id}'`, async function (err, result1) {
                if (err) {
                    return next(createError(404, err.message))
                }
                if (result1.affectedRows > 0) {
                    res.status(200).json({ success: true, message: "Document has been successfully uploaded" })
                } else {
                    return next(createError(404, "Document has not uploaded"))
                }
            })
        } else {
            return next(createError(404, "User not created"))
        }
    })
}






// Uplaod user dra cerificate
const uploadUserDraDocuments = (req, res, next) => {
    // console.log(req.file);
    if (!req.file) {
        // console.log('No file uploaded');
        return res.status(400).send('No file uploaded');
    }
    // console.log(req.file.filename);
    const imgUrl = process.env.IMAGEURL + req.file.filename;
    db.query(`SELECT request_id FROM userrequest WHERE id = '${req.params.userId}'`, async function (err, result) {
        if (err) {
            return next(createError(404, err.message))
        }
        if (result.length > 0) {
            db.query(`UPDATE userrequest SET dra_image = '${imgUrl}' WHERE request_id = '${result[0].request_id}'`, async function (err, result1) {
                if (err) {
                    return next(createError(404, err.message))
                }
                if (result1.affectedRows > 0) {
                    res.status(200).json({ success: true, message: "Document has been successfully uploaded" })
                } else {
                    return next(createError(404, "Document has not uploaded"))
                }
            })
        } else {
            return next(createError(404, "User not created"))
        }
    })
}




// Uplaod user dra cerificate
const uploadVehicleImageByUser = (req, res, next) => {
    // console.log(req.file);
    if (req.files.length < 1) {
        // console.log('No file uploaded');
        return res.status(400).send('No file uploaded');
    }
    // const img1 = 'http://localhost:4000/api/car_repo/image/' + req.files[0].filename;
    // const img2 = 'http://localhost:4000/api/car_repo/image/' + req.files[1].filename;
    // const img3 = 'http://localhost:4000/api/car_repo/image/' + req.files[2].filename;
    // const img4 = 'http://localhost:4000/api/car_repo/image/' + req.files[3].filename;
    // const img5 = 'http://localhost:4000/api/car_repo/image/' + req.files[4].filename;
    const img1 = process.env.IMAGEURL + req.files[0].filename;
    const img2 = process.env.IMAGEURL + req.files[1].filename;
    const img3 = process.env.IMAGEURL + req.files[2].filename;
    const img4 = process.env.IMAGEURL + req.files[3].filename;
    const img5 = process.env.IMAGEURL + req.files[4].filename;
    db.query(`INSERT INTO vehicleimage (first,second, third, forth, fifth, vehicle_id) VALUES ('${img1}','${img2}','${img3}','${img4}','${img5}','${342342}')`, async function (err, result1) {
        if (err) {
            return next(createError(404, err.message))
        }
        if (result1.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Record successfully confirmed" });
        } else {
            return next(createError(404, "Record not confirmed"))
        }
    })
}






module.exports = { vehicleRecordByUserId, userSignInRequest, vehicleFindByUserWithRcNumber, vehicleFindByUserWithRcNumberInSearch, confirmVehicleWithUserByRcNumberAndUserId, uploadUserKycDocuments, uploadUserDraDocuments, uploadUserImage, allVehicleRecordByUserId, vehicleFindByUserWithChassisNumberInSearch, confirmVehicleWithUserByChassisNumberAndUserId, vehicleFindByUserWithChassisNumber, vehicleFindByUserWithVehicleId, uploadVehicleImageByUser, confirmVehicleWithUserByVehicleIdAndUserId }