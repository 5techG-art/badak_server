const db = require("../config/database");
const createError = require("../error")

// const allUserSearch = async (req, res, next) => {
//     console.log("hello");
//     try {
//         db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
//             if (err) {
//                 return next((createError(404, err.message)))
//             }
//             console.log(result);
//             if (result.length > 0) {
//                 db.query(`SELECT * FROM usersearch LIMIT 200`, async function (err, result1) {
//                     if (err) {
//                         return next((createError(404, err.message)))
//                     }
//                     if (result1.length > 0) {
//                         res.status(200).json({ success: true, data: result1 })
//                     } else {
//                         next(createError(404, "Data not found"))
//                     }
//                 })
//             } else {
//                 res.status(404).json({ success: false, message: "You are not valid admin" })
//             }
//         })
//     } catch (error) {
//         next((createError(500, "Internal server error")))
//     }
// }


const allUserSearchFilterByDate = async (req, res, next) => {
    try {
        db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
            if (err) {
                return next((createError(404, err.message)))
            }
            if (result.length > 0) {
                db.query(`SELECT * FROM usersearch WHERE DATE(search_time) = '${req.body.date}' ORDER BY search_time DESC`, async function (err, result1) {
                    if (err) {
                        return next((createError(404, err.message)))
                    }
                    if (result1.length > 0) {
                        res.status(200).json({ success: true, data: result1 })
                    } else {
                        res.status(200).json({ success: true, message: "Data not found", data: result1 })
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

// const allUserSearchFilterByYearAndMonth = async (req, res, next) => {
//     try {
//         db.query(`SELECT * FROM admin WHERE admin_id = '${req.id.admin_id}'`, async function (err, result) {
//             if (err) {
//                 return next((createError(404, err.message)))
//             }
//             if (result.length > 0) {
//                 let date = Date.now()
//                 db.query(`SELECT * FROM usersearch WHERE MONTH(search_time) = MONTH(NOW()) AND YEAR(search_time) = YEAR(NOW()) LIMIT 200`, async function (err, result1) {
//                     if (err) {
//                         return next((createError(404, err.message)))
//                     }
//                     if (result1.length > 0) {
//                         res.status(200).json({ success: true, data: result1 })
//                     } else {
//                         res.status(200).json({ success: true, message: "Data not found", data: result1 })
//                     }
//                 })
//             } else {
//                 res.status(404).json({ success: false, message: "You are not valid admin" })
//             }
//         })
//     } catch (error) {
//         next((createError(500, "Internal server error")))
//     }
// }







// const searchQuery = (table, searchTerm, callback) => {
//     const query = `SELECT * FROM ${table} WHERE 1=0`;
  
//     connection.query(`DESCRIBE ${table}`, (error, results, fields) => {
//       if (error) {
//         callback(error);
//         return;
//       }
  
//       const columns = results.map(result => result.Field);
  
//       const whereClause = columns.map(column => `${column} LIKE '%${searchTerm}%'`).join(' OR ');
  
//       const fullQuery = `${query} AND (${whereClause})`;
  
//       connection.query(fullQuery, (error, results, fields) => {
//         if (error) {
//           callback(error);
//           return;
//         }
  
//         callback(null, results);
//       });
//     });
//   };
  
//   // Example usage:
//   searchQuery('mytable', 'search term', (error, results) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log(results);
//     }
// })


module.exports = { allUserSearchFilterByDate }