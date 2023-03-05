const db = require("../config/database");
const createError = require("../error");
const { v4: uuid } = require("uuid")

const userConfirmVehicle = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM confirmvehicle`, async function (err, result) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    return res.status(200).json({ success: true, data: result })
                })
            } else {
                return next(createError(400, "Only admin see this data"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const adminConfirmVehicle = async (req, res, next) => {
    const { confirm } = req.body
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM adminconfirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result3) {
                    if (err) {
                        next(createError(404, err.message))
                    }
                    if (result3.length > 0) {
                        db.query(`UPDATE adminconfirmvehicle SET is_confirm = '${confirm}' WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result2) {
                            if (err) {
                                next(createError(404, err.message))
                            }
                            if (result2.affectedRows > 0) {
                                db.query(`SELECT * FROM adminconfirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result3) {
                                    if (err) {
                                        next(createError(404, err.message))
                                    }
                                    res.status(200).json({ success: true, data: result3 })
                                })
                            } else {
                                next(createError(404, "Data not found"))
                            }
                        })
                    } else {
                        db.query(`INSERT INTO adminconfirmvehicle (rc_number, mek_and_model,vehicle_id, branch, financer, area, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no, is_confirm) SELECT rc_number, mek_and_model,vehicle_id, branch, financer, area, chassis_number, engine_number, level1, level2, level3,level1con, level2con, level3con, region, ex_name, od, bkt,gv,ses9,ses17,tbr, poss, level4, level4con, contract_no, '${confirm}' FROM vehicle WHERE vehicle_id = '${req.params.vehicleId}'`, async function (err, result1) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result1.affectedRows > 0) {
                                if (confirm == 1) {
                                    db.query(`DELETE FROM vehicle WHERE vehicle_id = '${req.params.vehicleId}'`, async function (err, result2) {
                                        if (err) {
                                            return next((createError(404, "This vehicle already exists")))
                                        }
                                        if (result2.affectedRows > 0) {
                                            db.query(`DELETE FROM confirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, async function (err, result3) {
                                                if (err) {
                                                    return next((createError(404, "This vehicle already exists")))
                                                }
                                                if (result3.affectedRows > 0) {
                                                    db.query(`SELECT * FROM adminconfirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result4) {
                                                        if (err) {
                                                            next(createError(404, err.message))
                                                        }
                                                        res.status(200).json({ success: true, data: result4 })
                                                    })
                                                } else {
                                                    next(createError(404, "Vehicle not found"))
                                                }
                                            })
                                        } else {
                                            next(createError(404, "Vehicle not found"))
                                        }
                                    })
                                } else {
                                    db.query(`DELETE FROM confirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, async function (err, result3) {
                                        if (err) {
                                            return next((createError(404, "This vehicle already exists")))
                                        }
                                        if (result3.affectedRows > 0) {
                                            db.query(`SELECT * FROM adminconfirmvehicle WHERE vehicle_id = '${req.params.vehicleId}'`, function (err, result4) {
                                                if (err) {
                                                    next(createError(404, err.message))
                                                }
                                                res.status(200).json({ success: true, data: result4 })
                                            })
                                        } else {
                                            next(createError(404, "Vehicle not found"))
                                        }
                                    })
                                }
                            } else {
                                return next(createError(400, "vehicle not found"))
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


const deleteBranchVehicle = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`DELETE FROM vehicle WHERE branch_code = '${req.params.branchId}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.affectedRows > 0) {
                        db.query(`UPDATE branch SET total_record = 0 WHERE id = '${req.params.branchId}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result1.affectedRows > 0) {
                                db.query(`SELECT * FROM branch WHERE id = '${req.params.branchId}'`, async function (err, result3) {
                                    if (err) {
                                        return next((createError(404, err.message)))
                                    }
                                    res.status(200).json({ success: true, message: "Successfully deleted", data: result3 })
                                })
                            } else {
                                next(createError(404, "Records have been already deleted"))
                            }
                        })
                    } else {
                        next(createError(404, "Records have been already deleted"))
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




const deleteVehicleById = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT branch_code FROM vehicle WHERE vehicle_id = '${req.body.vehicle_id}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        db.query(`DELETE FROM vehicle WHERE vehicle_id = '${req.body.vehicle_id}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.affectedRows > 0) {
                                db.query(`SELECT total_record FROM branch WHERE id = '${result1[0].branch_code}'`, async function (err, result3) {
                                    if (err) {
                                        return next((createError(404, err.message)))
                                    }
                                    if (result3.length > 0) {
                                        db.query(`UPDATE branch SET total_record = ${result3[0].total_record == 0 ? 0 : result3[0].total_record - result2.affectedRows} WHERE id = '${result1[0].branch_code}'`, async function (err, result4) {
                                            if (err) {
                                                return next((createError(404, err.message)))
                                            }
                                            if (result4.affectedRows > 0) {
                                                db.query(`SELECT * FROM branch WHERE id = '${result1[0].branch_code}'`, async function (err, result5) {
                                                    if (err) {
                                                        return next((createError(404, err.message)))
                                                    }
                                                    res.status(200).json({ success: true, message: "Successfully deleted", data: result5 })
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                return next(createError(404, "Vehicle not Deleted"))
                            }
                        })
                    } else {
                        return next(createError(404, "Vehicle not found"))
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


const deleteVehicleByRcNumber = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT branch_code FROM vehicle WHERE rc_number = '${req.params.rc_number}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        db.query(`DELETE FROM vehicle WHERE rc_number = '${req.params.rc_number}'`, async function (err, result2) {
                            if (err) {
                                return next((createError(404, err.message)))
                            }
                            if (result2.affectedRows > 0) {
                                db.query(`SELECT total_record FROM branch WHERE id = '${result1[0].branch_code}'`, async function (err, result3) {
                                    if (err) {
                                        return next((createError(404, err.message)))
                                    }
                                    if (result3.length > 0) {
                                        db.query(`UPDATE branch SET total_record = ${result3[0].total_record == 0 ? 0 : result3[0].total_record - result2.affectedRows} WHERE id = '${result1[0].branch_code}'`, async function (err, result4) {
                                            if (err) {
                                                return next((createError(404, err.message)))
                                            }
                                            if (result4.affectedRows > 0) {
                                                db.query(`SELECT * FROM branch WHERE id = '${result1[0].branch_code}'`, async function (err, result5) {
                                                    if (err) {
                                                        return next((createError(404, err.message)))
                                                    }
                                                    res.status(200).json({ success: true, message: "Successfully deleted", data: result5 })
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                return next(createError(404, "Vehicle not Deleted"))
                            }
                        })
                    } else {
                        return next(createError(404, "Vehicle not found"))
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




const vehicleWithLimit = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number,mek_and_model, vehicle_id FROM vehicle LIMIT 500`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const confirmVehicleWithLimit = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number,mek_and_model, vehicle_id FROM vehicle WHERE is_confirm = 1 LIMIT 500`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}





const confirmVehicleSearchWithChassisNumber = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number,mek_and_model, vehicle_id FROM vehicle WHERE is_confirm = 1 AND chassis_number LIKE '%${req.params.chassis_number}%'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}




const confirmVehicleSearchWithRcNumber = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number,mek_and_model, vehicle_id FROM vehicle WHERE is_confirm = 1 AND rc_number LIKE '%${req.params.rc_number}%'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}


const vehicleSearchByRcNumber = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number, vehicle_id FROM vehicle WHERE rc_number LIKE '%${req.body.rc_number}%'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

const vehicleSearchByChassisNumber = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT rc_number, chassis_number, vehicle_id FROM vehicle WHERE chassis_number LIKE '%${req.body.chassis_number}%'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}

// const vehicleDetailsByChassisNumber = async (req, res, next) => {
//     try {
//         db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
//             if (err) {
//                 return next((createError(404, err.message)))
//             }
//             if (result.length > 0) {
//                 db.query(`SELECT * FROM vehicle WHERE chassis_number='${req.body.chassis_number}'`, async function (err, result1) {
//                     if (err) {
//                         return next((createError(404, err.message)))
//                     }
//                     if (result1.length > 0) {
//                         res.status(200).json({ success: true, data: result1[0] })
//                     } else {
//                         res.status(404).json({ success: false, message: "Data not found" })
//                     }
//                 })
//             } else {
//                 next(createError(401, "You are not admin"))
//             }
//         })
//     } catch (error) {
//         next((createError(500, "Internal server error")))
//     }
// }

const vehicleDetails = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM vehicle WHERE vehicle_id='${req.body.vehicle_id}'`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        const { branch_code, finance_id, ...data1 } = result1[0]
                        db.query(`SELECT * FROM branch WHERE id='${result1[0].branch_code}'`, async function (err, result2) {
                            if (err) {
                                return next(createError(404, err))
                            }
                            if (result2.length > 0) {
                                db.query(`SELECT * FROM finance WHERE id='${result2[0].finance_id}'`, async function (err, result3) {
                                    if (err) {
                                        return next(createError(404, err))
                                    }
                                    const { id, finance_id, ...data2 } = result2[0]
                                    if (result3.length > 0) {
                                        const { id, ...data3 } = result3[0]
                                        res.status(200).json({ success: true, data: [data1, data2, data3] })
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(404).json({ success: false, message: "Data not found" })
                    }
                })
            } else {
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



const confirmVehicleDetailsWithImage = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM vehicle INNER JOIN vehicleimage ON vehicle.vehicle_id = vehicleimage.vehicle_id WHERE vehicle.vehicle_id = '${req.params.vehicleId}'`, async function (err, result1) {
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
                next(createError(401, "You are not admin"))
            }
        })
    } catch (error) {
        next((createError(500, "Internal server error")))
    }
}



module.exports = { adminConfirmVehicle, deleteBranchVehicle, userConfirmVehicle, deleteVehicleById, deleteVehicleByRcNumber, vehicleWithLimit, vehicleSearchByRcNumber, vehicleSearchByChassisNumber, vehicleDetails, confirmVehicleWithLimit, confirmVehicleSearchWithChassisNumber, confirmVehicleSearchWithRcNumber, confirmVehicleDetailsWithImage }