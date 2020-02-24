var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Recipe.findById(req.params.id, function (err, foundRecipe) {
            if (err) {
                req.flash("error", "Recipe not found");
                res.redirect("/recipes");
            } else {
                if (foundRecipe.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        //if logged in
        Comment.findById(req.params.commentId, (err, foundComment) => {
            if (err) {
                console.log("couldn't find comment" + err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        // if not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// defined isLoggedIn middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}









module.exports = middlewareObj;