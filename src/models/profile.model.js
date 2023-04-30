const { Schema, model } = require("mongoose");

const profile_scheme = new Schema({
    name : String
})

module.exports = model("profile", profile_scheme)