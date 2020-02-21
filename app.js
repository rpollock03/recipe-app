//------
// REQUIRE PACKAGES/MODELS
//------

const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override");

// mongoose models
const Recipe = require("./models/recipe"),
    User = require("./models/user");

// routes
const recipeRoutes = require("./routes/recipes"),
    userRoutes = require("./routes/users");

//------
// SETUP/CONFIG
//------

// basic express
const app = express();
const port = 5000;
app.use(express.static(__dirname + "/public"));
require('dotenv').config() // for .env files

// set templating engine to EJS
app.set('view engine', 'ejs');

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// method override
app.use(methodOverride("_method"));

// mongoose
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

//mongoose.set('useFindAndModify', false);
// could also mongoose.connect(...).then(console.log(`mongodb connected ${MONGO_URI}`)).catch(err=>console.log(err));
var db = mongoose.connection;
db.on('connected', () => console.log("Connected to database"));


// passport/passport-local config
app.use(require("express-session")({
    secret: "Tabby is a nice cat",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// the .authenticate method is what comes with mongoose-passport-local. without it we would have to write this. 
// without passport-local-mongoose would have to write the code to compare passwords, but here 2 lines all that's required

// in order for persistent sessions to work, we need to serailise authenticated user to the session, and deserialise when subsequent requests are made. We do this with passport local mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// import route files

app.use("/recipes", recipeRoutes);
app.use("/", userRoutes);


//------
// BASIC ROUTES
//------

app.get("/", (req, res) => res.render("landing"));

//------
// PORT SETTINGS
//------

app.listen(port, () => console.log(`Server starting on port ${port}!`));

