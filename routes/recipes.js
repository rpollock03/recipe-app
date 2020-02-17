const express = require("express");
const router = express.Router();
var Recipe = require("../models/recipe")

// NOTE: all of these routes preceded by /recipes. So "/" here is really the "/recipes" route


// INDEX ROUTE
router.get("/", (req, res) => res.render("recipes"))


// SHOW ROUTE

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
            res.send({ redirect: "/recipes" });
        }


    })







})




// EDIT ROUTE

// UPDATE ROUTE

// DESTROY ROUTE







module.exports = router;