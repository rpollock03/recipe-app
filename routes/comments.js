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
            var newComment = {
                text: req.body.text,
                author: req.body.author
            }

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

// edit route. comment_id can be anything, we just couldnt do id again because it would override the previous recipe id
router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { recipeId: req.params.id, comment: foundComment })
            // because of how routes set up, all comment routes have recipe ID as a parameter. Because we refer to recipe ID in the edit ejs file, we NEED to pass through recipe ID. Could either do mongoose recipe.findByID etc and send the whole recipe to the ejs file...OR just send the one bit we actually need, the recipe ID, by assigning req.params.id to a variable and sending it through. 
        }
    })
})

// COMMENT UPDATE ROUTE
router.put("/:commentId", (req, res) => {
    // 3 parameters: id, data to update, and callback
    var updatedComment = {
        text: req.body.text,
        author: req.body.author
    }
    Comment.findByIdAndUpdate(req.params.commentId, updatedComment, (err, result) => {
        if (err) {
            console.log(err);
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



module.exports = router;