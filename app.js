const express = require('express')
const cookieParser = require("cookie-parser")
const mongoose= require('mongoose')
const cors = require("cors")
const auth_routes = require("./src/routes/auth.routes") 
const { DATA_BASE } = require('./src/config')

const app = express()

// connect to mongodb
mongoose.connect(DATA_BASE)


// middleware set up
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : true,
    credentials : true,
}))

// routes
app.use("/auth", auth_routes)

app.get("/", (req, res) => {
    res.json({
        message : "working"
    })
})

app.listen(3000)

module.exports = app