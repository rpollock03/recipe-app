var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: String,
    //could just link to the entire author/user object via Id, but only really need id and username. could only do this with non-relational databases like mongo
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);