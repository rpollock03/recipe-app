const express = require("express");
const router = express.Router();
var Recipe = require("../models/recipe")
var Comment = require("../models/comment");

//nesting the comments route in the show routes.
// all routes here really begin with /recipes

// new ie recipes/:id/comments/new 
router.get("/:id/comments/new", (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { recipe: foundRecipe })
        }
    })
});

// create route, ie handle new comment logic
router.post("/:id/comments", (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            var newComment = req.body.comment;
            Comment.create(newComment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    foundRecipe.comments.push(comment);
                    foundRecipe.save();
                    res.redirect("/recipes/" + foundRecipe._id)
                }
            })
        }
    });
})












module.exports = router;