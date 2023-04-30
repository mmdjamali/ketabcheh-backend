const { Schema , model } = require("mongoose");

const user_scheme = new Schema({
    phone_number : String,
    email : String,
    profile : Schema.Types.ObjectId,
    password : String
})

module.exports = model("user", user_scheme, "users")