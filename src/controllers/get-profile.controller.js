const profile_model = require("../models/profile.model")
const user_model = require("../models/user.model")


const get_profile = async (req , res) => {
    const _id = req.user_id

    const user = await user_model.findOne({_id})

    if(!user) return res.sendStatus(400)

    const profile = await profile_model.findOne({_id : user.profile})

    if(!profile) return res.sendStatus(400)

    res.json({
        profile
    })
}

module.exports = get_profile