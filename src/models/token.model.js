const { Schema, model } = require("mongoose")

const token_schema = new Schema({
    value : String
})

module.exports = model("token", token_schema, "tokens")