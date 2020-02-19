//------
// SETUP AND CONFIG
//------

// express setup
const express = require("express");
const app = express();
const port = 5000;
// point to static files ie css
app.use(express.static(__dirname + "/public"));

// .env file
require('dotenv').config()
// host: process.env.DB_HOST,

// set templating engine to EJS
app.set('view engine', 'ejs');

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// method override
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// import route files
const recipeRoutes = require("./routes/recipes")
app.use("/recipes", recipeRoutes);

// mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
//mongoose.set('useFindAndModify', false);
// could also mongoose.connect(...).then(console.log(`mongodb connected ${MONGO_URI}`)).catch(err=>console.log(err));
var db = mongoose.connection;
db.on('connected', () => console.log("Connected to database"));
// mongoose models
var Recipe = require("./models/recipe");




//------
// BASIC ROUTES
//------

app.get("/", (req, res) => res.render("landing"));

//------
// PORT SETTINGS
//------

app.listen(port, () => console.log(`Server starting on port ${port}!`));

