const auth_routes = require("express").Router();
const { get_access_token } = require("../controllers/get-access-token.controller");
const get_profile = require("../controllers/get-profile.controller");
const login = require("../controllers/login.controller");
const sign_up = require("../controllers/sign-up.controller");
const access_confirm = require("../middlewares/check-auth.middleware");

auth_routes.get("/refresh",get_access_token)

auth_routes.post("/sign-up", sign_up)

auth_routes.get("/login", login)

auth_routes.get("/get-profile", access_confirm, get_profile)

module.exports = auth_routes