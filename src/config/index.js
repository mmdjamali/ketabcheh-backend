require("dotenv").config()

module.exports = {
    refresh_secret : process.env.REFRESH_TOKEN_SECRET,
    access_secret : process.env.ACCESS_TOKEN_SECRET
}