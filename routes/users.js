const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
var middleware = require("../middleware") //because file is named index.js it knows to be required without having to specify


// AUTH ROUTES

// get register page
router.get("/register", (req, res) => res.render("register"))

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
            req.flash("error", err.message) //err contains mongoosepassportlocal error message. 
            res.redirect("/");
        }
        // if registation successful log them in
        passport.authenticate("local")(req, res, function () {
            //req.flash("success", "Welcome, "+ user.username);
            res.redirect("/recipes");
        })
    })
})

//show login form
router.get("/login", (req, res) => res.render("login"))

// handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/recipes",
        failureRedirect: "/",
        failureFlash: true
    }));


//app.post /login middleware callback. break it up for readability. MIDDLEWAR
// .authenticated setup with passport.use(new LocalStrategy(User.authenticate()));
//authetnicate takes req.body.password and username with database. It takes care of the logic. we just say what to do when its done either way. Can get rid of the callback.
//difference between passport.authenticate in register and login, in the former we are doing things beforehand, whereas in the latter the req.body.username etc is presumed to exist already.

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
})

//.logout method comes with packages we installed

//settings page
router.get("/settings", middleware.isLoggedIn, (req, res) => {
    User.findOne({ "username": req.user.username }, (err, foundUser) => {
        if (err) {
            console.log("error finding user" + err);
        } else {
            var emailAddress = foundUser.email;
            res.render("settings", { email: emailAddress });
        }
    })
})


//handle settings logic
// IMPORTANT - findOne returns object, find returns array of objects so you need to do eg foundUser[0].email; if using that
router.post("/settings", middleware.isLoggedIn, (req, res) => {
    User.findOne({ "username": req.user.username }, (err, foundUser) => {
        if (err) {
            console.log("error finding user" + err);
        } else {
            foundUser.email = req.body.email;
            foundUser.save((err) => {
                if (err) {
                    req.flash("error", "Error updating email address") //err contains mongoosepassportlocal error message. 
                    res.redirect("/settings");
                }
            });
            foundUser.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
                if (err) {
                    req.flash("error", err.message) //err contains mongoosepassportlocal error message. 
                    res.redirect("/settings");
                }
                else {
                    req.flash("success", "New user information saved") //err contains mongoosepassportlocal error message. 
                    res.redirect("/settings");
                }
            })
        }
    })
})



module.exports = router;