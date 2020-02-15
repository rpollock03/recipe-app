const express = require("express");
const router = express.Router();

// INDEX ROUTE
router.get("/", (req, res) => res.render("recipes"))


// SHOW ROUTE

// NEW ROUTE

router.get("/new", (req, res) => res.render("newRecipe"));

// CREATE ROUTE

// EDIT ROUTE

// UPDATE ROUTE

// DESTROY ROUTE







module.exports = router;