const express = require("express");
const router = express.Router();
var Recipe = require("../models/recipe")
var middleware = require("../middleware") //because file is named index.js it knows to be required without having to specify

// NOTE: all of these routes preceded by /recipes. So "/" here is really the "/recipes" route

// INDEX ROUTE - the "@username's recipes main home page"
router.get("/", middleware.isLoggedIn, (req, res) => {
    Recipe.find({ "author.username": req.user.username }, (err, foundRecipes) => {
        if (err) {
            console.log("error finding recipes by author" + err);
        } else {
            res.render("recipes/recipes", { recipes: foundRecipes })
        }
    })
})

//all recipes page
router.get("/all", middleware.isLoggedIn, (req, res) => {
    Recipe.find({}, (err, foundRecipes) => {
        if (err) {
            console.log("error finding recipes by author" + err);
        } else {
            res.render("recipes/allRecipes", { recipes: foundRecipes })
        }
    })
})



// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("recipes/newRecipe"));

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    var newRecipe = {
        name: req.body.name,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        image: req.body.image,
        oneLiner: req.body.oneLiner,
        method: req.body.method,
        timeToMake: req.body.timeToMake,
        ingredients: req.body.ingredients
    };

    Recipe.create(newRecipe, (err, saved) => {
        if (err) console.log(err);
        else {
            req.flash("success", "New recipe added!");
            res.send({ redirect: "/recipes" }); // this necessary???!!!
        }
    })
})

// SHOW ROUTE - must be below /new
router.get("/:id", (req, res) => {
    // so without the populate/exec, it would return the recipe object, BUT as defined by recipe schema, the comments would just be an array of comment ids. We want the ACTUAL comments. so .populate makes that happen, while .exec runs the actual query.     
    Recipe.findById(req.params.id).populate("comments").exec((err, foundRecipe) => {
        if (err) {
            console.log("error finding recipe" + err);
        } else {
            res.render("recipes/showRecipe", { recipe: foundRecipe });
        }
    })
})


// EDIT ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log("error finding recipe" + err)
        } else {
            res.render("recipes/editRecipe", { recipe: foundRecipe })
        }
    })
})

// UPDATE ROUTE
router.put("/:id/edit", middleware.checkRecipeOwnership, (req, res) => {
    var updatedRecipe = {
        name: req.body.name,
        // dont need author because author data will be unchanged because only author will have access to edit button
        image: req.body.image,
        oneLiner: req.body.oneLiner,
        method: req.body.method,
        ingredients: req.body.ingredients,
        timeToMake: req.body.timeToMake
    }

    //new:true returns the updated value in the console.log, otherwise returns previous value. not necessary. 
    Recipe.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true }, (err, saved) => {
        if (err) {
            console.log("error updating recipe" + err);
        } else {
            req.flash("success", "Recipe updated!")
            res.send({ redirect: "/recipes" + req.params.id });
        }
    })
})

// DESTROY ROUTE
router.delete("/:id", middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/recipes");
        } else {
            req.flash("success", "Recipe deleted!")
            res.redirect("/recipes");
        }
    })
})


module.exports = router;