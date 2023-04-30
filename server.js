const express = require('express')
const crypto = require("crypto")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const mongoose= require('mongoose')

mongoose.connect("mongodb://localhost:27017/testdb")

const BookSchema = new mongoose.Schema({
    name : String
})

const Books = mongoose.model("book",BookSchema,"books") 

const run = async () => {
    try{
        const books = await Books.find({})
        console.log(books)
    }
    catch(err){
        console.log(err)
    }
}
run()

require("dotenv").config()

const refresh_secret = process.env.REFRESH_TOKEN_SECRET
const access_secret = process.env.ACCESS_TOKEN_SECRET

const app = express()
const port = 3000

const users = []

const profiles = []

let tokens = []

const posts = []

app.use(cookieParser())

const accessConfirm = (req , res , next) => {
    const access_token = req.headers["authorization"].split(" ")[1]

    jwt.verify(access_token, access_secret , (err, user) => {
        if(err) return res.status(403).json({
            message : "token is not valid"
        })

        req.user_id = user.id
        next()
        return
    })
} 

app.use(cors({
    origin : true,
    credentials : true,
}))
app.use(express.json())

app.post("/sign-up", async (req,res) => {
    const { email,password,name, phone } = req.body

    if(!email || !password || !name) return res.status(401)

    if(users.find(u => u.email === email)) return res.status(401).json({
        message : "user already exists"
    })

    const pass = await bcrypt.hash(password, 10)
    
    const profile = {
        id : crypto.randomBytes(12).toString("hex"),
        name,
        email,
    }

    const user = {
        id : crypto.randomBytes(12).toString("hex"),
        profile : profile.id,
        email,
        password : pass,
        phone
    }

    const refresh_token = jwt.sign({ id : user.id },refresh_secret)

    profiles.push(profile)
    users.push(user)
    tokens.push(refresh_token)

    res.cookie("refresh_token" , refresh_token ,{
        httpOnly : true
    }).sendStatus(200)
})

app.get("/login",async (req , res) => {
    const { email , password } = req.body
    
    if(!email || !password) return res.sendStatus(401)

    const user = users.find(u => u.email === email)

    if(!user) return res.status(404).json({
        message : "no such user exists"
    })

    try{
        if(!await bcrypt.compare(password, user.password)) return res.status(401).json({
            message : "wrong password"
        })

        const refresh_token = jwt.sign({ id : user.id },refresh_secret)

        tokens.push(refresh_token)

        res.cookie("refresh_token",refresh_token, { httpOnly: true }).send()
    }
    catch(err){
        console.log(err?.message)
    }

})

app.get("/posts", accessConfirm, (req , res) => {
    
    const profileID = users.find(u => u.id === req?.user_id).profile
    const data = posts.filter((p) => p.author === profileID)
    
    res.json({
        data
    })
})

app.get("/refresh",(req, res) => {
    const { refresh_token } = req?.cookies

    if(!refresh_token) return res.sendStatus(401)

    if(!tokens.includes(refresh_token)) return res.sendStatus(401)

    jwt.verify(refresh_token, refresh_secret, ( err , user) => {
        if(err) return res.status(401).json({
            message : "your token is not valid"
        })

        const new_token = jwt.sign({id : user.id} , access_secret, {
            expiresIn : "10s"
        })

        res.json({
            token : new_token
        })
    })
})

app.get("/profile", accessConfirm , (req, res) => {
    const profileID = users.find(u => u.id === req?.user_id)?.profile
    
    if(!profileID) return res.sendStatus(404)
    
    const profile = profiles.find(p => p.id === profileID)

    if(!profile) return res.sendStatus(404)

    res.json({
        profile
    })
})

app.delete("/logout", ( req, res) => {
    const { token } = req.body
    tokens = tokens.filter((t) => t !== token)
    
    res.json({
        message : "logout was successful"
    })
})

app.listen(port,() => {
    console.log("server listening to :" + port)
})