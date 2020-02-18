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
            res.render("recipes", { recipes: foundRecipes })
        }
    })
})

// NEW ROUTE

router.get("/new", (req, res) => res.render("newRecipe"));

// CREATE ROUTE

router.post("/", (req, res) => {
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
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log("error finding recipe" + err);
        } else {
            res.render("showRecipe", { recipe: foundRecipe });
        }
    })
})


// EDIT ROUTE
router.get("/:id/edit", (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) {
            console.log("error finding recipe" + err)
        } else {
            res.render("editRecipe", { recipe: foundRecipe })
        }
    })
})

// UPDATE ROUTE
router.put("/:id/edit", (req, res) => {
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
router.delete("/:id", (req, res) => {
    Recipe.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
    })
})






module.exports = router;