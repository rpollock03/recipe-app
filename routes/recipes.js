const express = require("express");
const router = express.Router();


// NOTE: all of these routes preceded by /recipes. So "/" here is really the "/recipes" route


// INDEX ROUTE
router.get("/", (req, res) => res.render("recipes"))


// SHOW ROUTE

// NEW ROUTE

router.get("/new", (req, res) => res.render("newRecipe"));

// CREATE ROUTE

router.post("/", (req, res) => {

    console.log(req.body.oneLiner)
    res.send({ redirect: "/recipes" });
})




// EDIT ROUTE

// UPDATE ROUTE

// DESTROY ROUTE







module.exports = router;