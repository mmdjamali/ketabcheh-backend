const express = require('express')
const cookieParser = require("cookie-parser")
const mongoose= require('mongoose')
const cors = require("cors")
const auth_routes = require("./routes/auth.routes") 

const app = express()

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/testdb")


// middleware set up
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : true,
    credentials : true,
}))

// routes
app.use("/auth", auth_routes)

app.listen(3000 , () => {
    console.log("server listening to port 3000")
})