module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be Signin to create listing");
        res.redirect("/signin");
    }
    next();
}