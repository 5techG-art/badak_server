const db = require('./config/database')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv')
const register = require('./routes/auth')
const records = require('./routes/records')
const user = require('./routes/user')
const vehicle = require('./routes/vehicle')
const finance = require('./routes/finance')
const branch = require('./routes/branch')
const usersearch = require('./routes/usersearch')
const appUser = require('./routes/app/user')
const cookies = require('cookie-parser')
const helmet = require('helmet')
dotenv.config()

// Enable CORS and Body Parser middlewares
app.use("/api/car_repo/image", express.static('public/uploads'))
app.use(express.json())
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://badak.in", "http://localhost:3000", "https://badak-client.onrender.com"]
}));
app.use(helmet())
app.use(cookies())


app.get("/test", (req, res) => {
    db.getConnection((err) => {
        if (err)
            res.status(200).send(err.message)
        res.status(200).send("Running...")
    })
})


app.use("/api/user", register)
app.use("/api/records", records)
app.use("/api/users", user)
app.use("/api/vehicle", vehicle)
app.use("/api/finance", finance)
app.use("/api/branch", branch)
app.use("/api/search", usersearch)
app.use("/api/app/user", appUser)


// error handle
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went worng!";
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })
})

// Port setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
