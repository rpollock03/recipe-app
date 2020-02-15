// express setup
const express = require("express");
const app = express();
const port = 5000;

// set templating engine to EJS
app.set('view engine', 'ejs');


//--
// BASIC ROUTES
//--

app.get("/", (req, res) => res.render("landing"));

app.get("/recipes", (req, res) => res.render("recipes"))


// Port
app.listen(port, () => console.log(`Server starting on port ${port}!`));

