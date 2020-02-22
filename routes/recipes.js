const express = require("express");
const router = express.Router();
var Recipe = require("../models/recipe")

// NOTE: all of these routes preceded by /recipes. So "/" here is really the "/recipes" route


// INDEX ROUTE
router.get("/", (req, res) => {
    Recipe.find({ author: "rob" }, (err, foundRecipes) => {
        if (err) {
            console.log("error finding recipes by author" + err);
        } else {
            res.render("recipes/recipes", { recipes: foundRecipes })
        }
    })
})

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => res.render("recipes/newRecipe"));

// CREATE ROUTE

router.post("/", isLoggedIn, (req, res) => {
    var newRecipe = {
        name: req.body.name,
        author: "rob",
        image: req.body.image,
        oneLiner: req.body.oneLiner,
        method: req.body.method,
        ingredients: req.body.ingredients
    }

    Recipe.create(newRecipe, (err, saved) => {
        if (err) console.log(err);
        else {
            console.log(saved);
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
router.get("/:id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log("error finding recipe" + err)
        } else {
            res.render("recipes/editRecipe", { recipe: foundRecipe })
        }
    })
})

// UPDATE ROUTE
router.put("/:id/edit", isLoggedIn, (req, res) => {
    var updatedRecipe = {
        name: req.body.name,
        author: "rob",
        image: req.body.image,
        oneLiner: req.body.oneLiner,
        method: req.body.method,
        ingredients: req.body.ingredients
    }
    //new:true returns the updated value in the console.log, otherwise returns previous value. not necessary. 
    Recipe.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true }, (err, saved) => {
        if (err) {
            console.log("error updating recipe" + err);
        } else {
            console.log(saved);
            res.send({ redirect: "/recipes" }); // this necessary???!!!
        }

    })

})

// DESTROY ROUTE
router.delete("/:id", isLoggedIn, (req, res) => {
    Recipe.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
    })
})

// defined isLoggedIn middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}




module.exports = router;