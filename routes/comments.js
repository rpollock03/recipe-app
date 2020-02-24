const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams Preserve the req.params values from the parent router eg recipe ID 
var Recipe = require("../models/recipe")
var Comment = require("../models/comment");
var middleware = require("../middleware") //because file is named index.js it knows to be required without having to specify


//nesting the comments route in the show routes.
// all routes here really begin with /recipes/:id/comments

// new ie recipes/:id/comments/new 
router.get("/new", middleware.isLoggedIn, (req, res) => {

    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { recipe: foundRecipe })
        }
    })
});

// create route, ie handle new comment logic
router.post("/", middleware.isLoggedIn, (req, res) => {
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

                    res.redirect("/recipes/" + foundRecipe._id)
                }
            })
        }
    });
})

// edit route. comment_id can be anything, we just couldnt do id again because it would override the previous recipe id
router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
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
router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
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
router.delete("/:commentId", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId, (err, result) => {
        if (err) {
            console.log("error deleting comment" + err);
            res.redirect("/recipes/" + req.params.id)
        } else {
            res.redirect("/recipes/" + req.params.id)
        }
    })
})

module.exports = router;