const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams Preserve the req.params values from the parent router eg recipe ID 
var Recipe = require("../models/recipe")
var Comment = require("../models/comment");

//nesting the comments route in the show routes.
// all routes here really begin with /recipes/:id/comments

// new ie recipes/:id/comments/new 
router.get("/new", isLoggedIn, (req, res) => {

    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { recipe: foundRecipe })
        }
    })
});

// create route, ie handle new comment logic
router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // as per schema, author has an id and username
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundRecipe.comments.push(comment);
                    foundRecipe.save();
                    console.log(foundRecipe);
                    console.log(comment.author);
                    console.log(comment);
                    res.redirect("/recipes/" + foundRecipe._id)
                }
            })
        }
    });
})

// edit route. comment_id can be anything, we just couldnt do id again because it would override the previous recipe id
router.get("/:commentId/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentId, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { recipeId: req.params.id, comment: foundComment })
            // because of how routes set up, all comment routes have recipe ID as a parameter. Because we refer to recipe ID in the edit ejs file, we NEED to pass through recipe ID. Could either do mongoose recipe.findByID etc and send the whole recipe to the ejs file...OR just send the one bit we actually need, the recipe ID, by assigning req.params.id to a variable and sending it through. 
        }
    })
})

// COMMENT UPDATE ROUTE
router.put("/:commentId", checkCommentOwnership, (req, res) => {
    // 3 parameters: id, data to update, and callback
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/recipes/" + req.params.id)
        }
    })
})

// DESTROY ROUTE
router.delete("/:commentId", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId, (err, result) => {
        if (err) {
            console.log("error deleting comment" + err);
            res.redirect("/recipes/" + req.params.id)
        } else {
            res.redirect("/recipes/" + req.params.id)
        }
    })
})



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
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
                    res.redirect("back");
                }
            }
        })
    } else {
        // if not logged in
        res.redirect("back");
    }

}



module.exports = router;