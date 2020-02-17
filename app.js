// express setup
const express = require("express");
const app = express();
const port = 5000;

// .env file
require('dotenv').config()
// host: process.env.DB_HOST,

// set templating engine to EJS
app.set('view engine', 'ejs');

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// import route files
const recipeRoutes = require("./routes/recipes")
app.use("/recipes", recipeRoutes);

// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe-app', { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('connected', () => console.log("Connected to database"));

//--
// BASIC ROUTES
//--

app.get("/", (req, res) => res.render("landing"));



// Port
app.listen(port, () => console.log(`Server starting on port ${port}!`));

