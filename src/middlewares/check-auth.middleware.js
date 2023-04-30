const jwt = require("jsonwebtoken")
const { access_secret } = require("../config")

const access_confirm = (req , res , next) => {
    const access_token = req.headers["authorization"].split(" ")[1]

    jwt.verify(access_token, access_secret , (err, user) => {
        if(err) return res.status(403).json({
            message : "token is not valid"
        })

        req.user_id = user._id
        next()
        return
    })
} 

module.exports = access_confirm