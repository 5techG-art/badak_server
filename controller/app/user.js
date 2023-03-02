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



// login 
// user sign in request handle
const userLoginInRequest = async (req, res, next) => {
    const { mobile } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(createError(404, `${errors.array().map(value => {
            return " " + value.param
        })} is required`))
    }
    try {
        db.query(`SELECT mobile FROM userrequest WHERE mobile = '${mobile}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0)
                res.status(200).json({ success: false, message: "This mobile number is already in use" })
            else
                next(createError(404, "This mobile number is not in use"))
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
            if (result1.length > 0) {
                db.query(`SELECT update_date FROM uservehicledate WHERE user_id= '${req.id}'`, function (err, result3) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    if (result3.length > 0) {
                        const userFirstDate = new Date(result3[0].update_date)
                        const year = userFirstDate.getFullYear();
                        const month = ('0' + (userFirstDate.getMonth() + 1)).slice(-2);
                        const day = ('0' + userFirstDate.getDate()).slice(-2);
                        const hour = ('0' + userFirstDate.getHours()).slice(-2);
                        const minute = ('0' + userFirstDate.getMinutes()).slice(-2);
                        const second = ('0' + userFirstDate.getSeconds()).slice(-2);
                        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                        if (result1[0].finance_id.length === 0) {
                            db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch,financer, area, bkt, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle WHERE upload_time > '${formattedDate}'`, function (err, result2) {
                                if (err) {
                                    next(createError(404, err.message))
                                }
                                // res.json({ success: true, total: result2.length, data: result2 });
                                if (result2.length > 0) {
                                    db.query(`UPDATE uservehicledate SET update_date = CURRENT_TIMESTAMP`, function (err, result4) {
                                        if (err) {
                                            next(createError(404, err.message))
                                        }
                                        console.log(result4);
                                        if (result4.affectedRows > 0) {
                                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                                        }
                                    })
                                } else {
                                    res.status(200).json({ success: true, data: result2, message: "Data not for update" })
                                }
                            })
                        } else {
                            let values = result1[0].finance_id.slice(0, -1)
                            const elements = values.split(",").filter(Boolean);
                            const quotedElements = elements.map(element => `'${element}'`);
                            const outputString = quotedElements.join(",");
                            db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch, financer, area, bkt, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle WHERE finance_id NOT IN (${outputString}) AND upload_time > '${formattedDate}'`, function (err, result2) {
                                if (err) {
                                    next(createError(404, err.message))
                                }
                                if (result2.length > 0) {
                                    db.query(`UPDATE uservehicledate SET update_date = CURRENT_TIMESTAMP`, function (err, result4) {
                                        if (err) {
                                            next(createError(404, err.message))
                                        }
                                        console.log(result4);
                                        if (result4.affectedRows > 0) {
                                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                                        }
                                    })
                                } else {
                                    res.status(200).json({ success: true, data: result2, message: "Data not for update" })
                                }
                            })
                        }
                    } else {
                        if (result1[0].finance_id.length === 0) {
                            db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch,financer, area, bkt, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle`, function (err, result2) {
                                if (err) {
                                    next(createError(404, err.message))
                                }
                                if (result2.length > 0) {
                                    db.query(`INSERT INTO uservehicledate (user_id, update_date) VALUES ('${req.id}', CURRENT_TIMESTAMP)`, function (err, result4) {
                                        if (err) {
                                            next(createError(404, err.message))
                                        }
                                        console.log(result4);
                                        if (result4.affectedRows > 0) {
                                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                                        }
                                    })
                                } else {
                                    next(createError(404, "Data not found"))
                                }
                            })
                        } else {
                            let values = result1[0].finance_id.slice(0, -1)
                            const elements = values.split(",").filter(Boolean);
                            const quotedElements = elements.map(element => `'${element}'`);
                            const outputString = quotedElements.join(",");
                            db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch, financer, area, bkt, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle WHERE finance_id NOT IN (${outputString})`, function (err, result2) {
                                if (err) {
                                    return res.json({ success: false, message: err.message });
                                }
                                if (result2.length > 0) {
                                    db.query(`INSERT INTO uservehicledate (user_id, update_date) VALUES ('${req.id}', CURRENT_TIMESTAMP)`, function (err, result4) {
                                        if (err) {
                                            next(createError(404, err.message))
                                        }
                                        console.log(result4);
                                        if (result4.affectedRows > 0) {
                                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                                        } else {
                                            next(createError(404, "Not upload"))
                                        }
                                    })
                                } else {
                                    next(createError(404, "Data not found"))
                                }
                            })
                        }
                    }
                })
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






// ***************  FOR TESTING  START  ****************

// post request for all rc number & Mek and Model from vehicle table with user id
const allVehicleRecordByUserIds = (req, res, next) => {
    try {
        db.query(`SELECT finance_id FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch,financer, area, bkt, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle`, function (err, result2) {
                        if (err) {
                            next(createError(404, err.message))
                        }
                        if (result2.length > 0) {
                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                        } else {
                            next(createError(404, "Data not found"))
                        }
                    })
                } else {
                    let values = result1[0].finance_id.slice(0, -1)
                    const elements = values.split(",").filter(Boolean);
                    const quotedElements = elements.map(element => `'${element}'`);
                    const outputString = quotedElements.join(",");
                    db.query(`SELECT rc_number, mek_and_model, chassis_number,vehicle_id, branch, financer, area, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no FROM vehicle WHERE finance_id NOT IN (${outputString})`, function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        if (result2.length > 0) {
                            res.status(200).json({ success: true, total: result2.length, data: result2 });
                        } else {
                            next(createError(404, "Data not found"))
                        }
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


// ***************  FOR TESTING  END  ****************


// post request for all rc number & Mek and Model from vehicle table with user id
const vehicleFindByUserWithVehicleId = (req, res, next) => {
    try {
        console.log(req.id);
        db.query(`SELECT finance_id, name FROM users WHERE user_id = '${req.id}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                if (result1[0].finance_id.length === 0) {
                    db.query(`SELECT * FROM vehicle WHERE vehicle_id = ?`, [req.params.vehicleId], function (err, result2) {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        if (result2.length > 0) {
                            db.query(`INSERT INTO usersearch (rc_number, mek_and_model, chassis_number,vehicle_id, user_id, location, longitude, latitude, user_name) VALUES ('${result2[0].rc_number}','${result2[0].mek_and_model}','${result2[0].chassis_number}','${result2[0].vehicle_id}', '${req.id}','${req.body.location}','${req.body.longitude}','${req.body.latitude}','${result1[0].name}')`, function (err, result6) {
                                if (err) {
                                    next(createError(404, err.message))
                                }
                                console.log(result6);
                                if (result6.affectedRows > 0) {
                                    const { branch_code, finance_id, is_confirm, is_cancel, vehicle_id, ...data } = result2[0]
                                    res.status(200).json({ success: true, data: data });
                                } else {
                                    next(createError(404, "Unsuccessful"))
                                }
                            })
                        } else {
                            res.status(404).json({ success: false, message: "Data not found" })
                        }
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
                        if (result2.length > 0) {
                            db.query(`INSERT INTO usersearch (rc_number, mek_and_model, chassis_number,vehicle_id, user_id, location, longitude, latitude, user_name) VALUES ('${result2[0].rc_number}','${result2[0].mek_and_model}','${result2[0].chassis_number}','${result2[0].vehicle_id}', '${req.id}','${req.body.location}','${req.body.longitude}','${req.body.latitude}','${result1[0].name}')`)
                            const { branch_code, finance_id, is_confirm, is_cancel, vehicle_id, ...data } = result2[0]
                            res.status(200).json({ success: true, data: data });
                        } else {
                            res.status(404).json({ success: false, message: "Data not found" })
                        }
                    })
                }
            } else {
                next(createError(404, "User not found"))
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
                        if (result2.length > 0) {
                            res.status(200).json({ success: true, data: result2 });
                        } else {
                            res.status(404).json({ success: true, message: "Data not found", data: result2 });
                        }
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
                        if (result2.length > 0) {
                            res.status(200).json({ success: true, data: result2 });
                        } else {
                            res.status(404).json({ success: true, message: "Data not found", data: result2 });
                        }
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
        db.query(`SELECT name FROM users WHERE user_id = '${req.id}'`, function (err, result) {
            if (err) {
                return res.json({ success: false, message: err.message });
            }
            if (result.length > 0) {
                db.query(`INSERT INTO confirmvehicle (rc_number, chassis_number,mek_and_model, user_id, name, vehicle_id) SELECT rc_number, chassis_number,mek_and_model, '${req.id}', '${result[0].name}', '${req.params.vehicleId}' FROM vehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result1) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    if (result1.affectedRows > 0) {
                        res.status(200).json({ success: true, message: "Vehicle confirmed" })
                    } else {
                        return next(createError(404, "Vehicle not found"))
                    }
                })
            } else {
                next(createError(404, "User not found"))
            }
        })
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal server error"))
    }
}




const alreadyConfirmVehicleWithUserByVehicleIdAndUserId = (req, res, next) => {
    try {
        db.query(`SELECT * FROM confirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.length > 0) {
                next(createError(404, "This vehicle is already confirmed"))
            } else {
                db.query(`SELECT * FROM vehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result2) {
                    if (err) {
                        return next(createError(404, err.message))
                    }
                    if (result2.length > 0) {
                        next()
                    } else {
                        next(createError(404, "This vehicle not found"))
                    }
                });
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
    try {
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
    } catch (error) {
        console.log(error);
        next(createError(500, "Internal server error"))
    }
}




// Upload user kyc images
const uploadUserKycDocuments = (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error);
        next(createError(500, "Internal server error"))
    }
}






// Uplaod user dra cerificate
const uploadUserDraDocuments = (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error);
        next(createError(500, "Internal server error"))
    }
}




// Uplaod user dra cerificate
const uploadVehicleImageByUser = (req, res, next) => {
    try {
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
        let img1 = '', img2 = '', img3 = '', img4 = '', img5 = ''
        if (req.files.length === 1) {
            img1 = process.env.IMAGEURL + req.files[0].filename;
        } else if (req.files.length === 2) {
            img1 = process.env.IMAGEURL + req.files[0].filename;
            img2 = process.env.IMAGEURL + req.files[1].filename;
        } else if (req.files.length === 3) {
            img1 = process.env.IMAGEURL + req.files[0].filename;
            img2 = process.env.IMAGEURL + req.files[1].filename;
            img3 = process.env.IMAGEURL + req.files[2].filename;
        } else if (req.files.length === 4) {
            img1 = process.env.IMAGEURL + req.files[0].filename;
            img2 = process.env.IMAGEURL + req.files[1].filename;
            img3 = process.env.IMAGEURL + req.files[2].filename;
            img4 = process.env.IMAGEURL + req.files[3].filename;
        } else if (req.files.length === 5) {
            img1 = process.env.IMAGEURL + req.files[0].filename;
            img2 = process.env.IMAGEURL + req.files[1].filename;
            img3 = process.env.IMAGEURL + req.files[2].filename;
            img4 = process.env.IMAGEURL + req.files[3].filename;
            img5 = process.env.IMAGEURL + req.files[4].filename;
        } else {
            next(createError(404, "Only five images are allowed"))
        }
        db.query(`INSERT INTO vehicleimage (first,second, third, forth, fifth, vehicle_id) VALUES ('${img1}','${img2}','${img3}','${img4}','${img5}','${req.params.vehicleId}')`, async function (err, result1) {
            if (err) {
                return next(createError(404, err.message))
            }
            if (result1.affectedRows > 0) {
                next()
            } else {
                return next(createError(404, "Record not confirmed"))
            }
        })
    } catch (error) {
        console.log(error);
        next(500, "Internal server error")
    }
}






module.exports = { vehicleRecordByUserId, userSignInRequest, vehicleFindByUserWithRcNumber, vehicleFindByUserWithRcNumberInSearch, confirmVehicleWithUserByRcNumberAndUserId, uploadUserKycDocuments, uploadUserDraDocuments, uploadUserImage, allVehicleRecordByUserId, vehicleFindByUserWithChassisNumberInSearch, confirmVehicleWithUserByChassisNumberAndUserId, vehicleFindByUserWithChassisNumber, vehicleFindByUserWithVehicleId, uploadVehicleImageByUser, confirmVehicleWithUserByVehicleIdAndUserId, allVehicleRecordByUserIds, userLoginInRequest, alreadyConfirmVehicleWithUserByVehicleIdAndUserId }