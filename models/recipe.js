var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    name: String,
    author: String,
    image: String,
    oneLiner: String,
    method: String,
    ingredients: [String]

});

// compiles schema, allows methods to be used via Recipe.method, and exports so can be accessed in other files. 
module.exports = mongoose.model("Recipe", recipeSchema);