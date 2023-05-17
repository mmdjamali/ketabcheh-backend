const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const user_model = require("../models/user.model")
const profile_model = require("../models/profile.model")
const token_model = require("../models/token.model")
const { refresh_secret } = require("../config")

const sign_up = async (req, res) => {
    const { email, password, name, phone } = req.body

    if(!email , !password, !name, !phone) return res.sendStatus(400)
    try{
        if(await user_model.exists({ email }) || await user_model.exists({phone})) return res.status(400).json({
            message : "user already exists"
        })

        const encrypted_pass = await bcrypt.hash(password,10)

        const profile = await profile_model.create({
            name
        })

        const user = await user_model.create({
            password : encrypted_pass,
            phone_number : phone,
            email,
            profile : profile._id
        })

        const refresh_token = jwt.sign({ _id : user._id },refresh_secret)

        await token_model.create({
            value : refresh_token
        })

        res.cookie("ktb_refresh_token", refresh_token, {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }).send()
    }
    catch(err){
        return sendStatus(500)
    }
}

module.exports = sign_up
