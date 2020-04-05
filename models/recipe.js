var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    name: String,
    // this is a subdocument which is why we use mongoose id thing...
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    image: String,
    oneLiner: String,
    method: String,
    timeToMake: Number,
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