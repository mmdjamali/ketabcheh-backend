const auth_routes = require("express").Router();
const { get_access_token } = require("../controllers/get-access-token.controller");
const login = require("../controllers/login.controller");
const sign_up = require("../controllers/sign-up.controller");

auth_routes.get("/refresh",get_access_token)

auth_routes.post("/sign-up", sign_up)

auth_routes.get("/login", login)

module.exports = auth_routes