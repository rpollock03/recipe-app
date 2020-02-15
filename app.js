// express setup
const express = require("express");
const app = express();
const port = 5000;

// set templating engine to EJS
app.set('view engine', 'ejs');

// import route files
const recipeRoutes = require("./routes/recipes")
app.use("/recipes", recipeRoutes);


//--
// BASIC ROUTES
//--

app.get("/", (req, res) => res.render("landing"));




// Port
app.listen(port, () => console.log(`Server starting on port ${port}!`));

