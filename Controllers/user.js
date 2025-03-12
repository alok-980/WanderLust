const User = require("../models/user.js");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.Signup = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/signin.ejs");
}

module.exports.loginUser = passport.authenticate('local', {
    failureRedirect: "/signin",
    failureFlash: true
})

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");

    let redirectUrl = res.locals.redirectUrl || "/listing";

    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listing");
    })
}