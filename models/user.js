var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
        required: true
    }
    // password field not required, as passport-local-mongoose takes care of that, along with methods to hash password etc
});

// plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// export userschema
module.exports = mongoose.model("User", userSchema);