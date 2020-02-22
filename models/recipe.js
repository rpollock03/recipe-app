var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    name: String,
    author: String,
    image: String,
    oneLiner: String,
    method: String,
    ingredients: [String],
    comments: [
        {   // .comments property should be an array of comment ids
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]

});

// compiles schema, allows methods to be used via Recipe.method, and exports so can be accessed in other files. 
module.exports = mongoose.model("Recipe", recipeSchema);