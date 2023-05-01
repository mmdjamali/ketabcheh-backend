const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const user_model = require("../models/user.model")
const { refresh_secret } = require("../config")
const token_model = require("../models/token.model")

const login = async (req, res) => {
    const email = req.body?.email
    const phone_number = req.body?.phone
    const password = req.body?.password

    if(!password && ( !email || !phone_number )) {
        return res.sendStatus(400)
    }

    try{
        const user = await user_model.findOne(email ? { email } : { phone_number })

        if(!user?.password) return res.status(400).json({
            message : "user not exists"
        })

        if(!await bcrypt.compare(password , user.password)) return res.status(401).json({
            message : "wrong password"
        })

        const refresh_token = jwt.sign({ _id : user._id } , refresh_secret)

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
        res.sendStatus(500)
    }
}

module.exports = login