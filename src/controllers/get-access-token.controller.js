const jwt = require("jsonwebtoken")
const tokenModel = require("../models/token.model")
const { access_secret, refresh_secret } = require("../config/index.js")

const get_access_token = async (req, res) => {
    const { ktb_refresh_token } = req?.cookies

    if(!ktb_refresh_token) return res.sendStatus(401)

    const exists = await tokenModel.exists({ value : ktb_refresh_token })

    if(!exists) return res.sendStatus(401)

    jwt.verify(ktb_refresh_token, refresh_secret, ( err , user) => {
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
}

module.exports = {
    get_access_token
}