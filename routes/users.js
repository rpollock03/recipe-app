const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user")

// AUTH ROUTES

// get register page
router.get("/register", (req, res) => {
    res.render("register");
})

// handle user register logic
router.post("/register", (req, res) => {
    //.register provided by passportlocalmongoose
    // password is SECOND argument passed into .register. Mongoose hashes and returns complete username with hashed password
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    })
    User.register(newUser, req.body.password, (err, registeredUser) => {
        if (err) {
            console.log(err);  // localmongoose includes error messages which we can pass on to user
            return res.render("register");
        }
        // if registation successful log them in
        passport.authenticate("local")(req, res, function () {
            res.redirect("/recipes");
        })
    })
})

//show login form
router.get("/login", (req, res) => {
    res.render("login");
})

// handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/recipes",
        failureRedirect: "/login"
    }));

//app.post /login middleware callback. break it up for readability. MIDDLEWAR
// .authenticated setup with passport.use(new LocalStrategy(User.authenticate()));
//authetnicate takes req.body.password and username with database. It takes care of the logic. we just say what to do when its done either way. Can get rid of the callback.
//difference between passport.authenticate in register and login, in the former we are doing things beforehand, whereas in the latter the req.body.username etc is presumed to exist already.

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

//.logout method comes with packages we installed


module.exports = router;