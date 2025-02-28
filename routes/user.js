const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listing");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}))

router.get("/signin", (req, res) => {
    res.render("./users/signin.ejs");
})

router.post(
    "/signin",
    passport.authenticate('local', {
        failureRedirect: "/signin",
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        res.redirect("/listing");
    }
)

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listing");
    })
})

module.exports = router;
