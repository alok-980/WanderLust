const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.Signup))

router
    .route("/signin")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        userController.loginUser,
        userController.Login
    )

router.get("/logout", userController.logoutUser)

module.exports = router;
