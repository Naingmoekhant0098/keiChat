const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    profile : {
        type :String,
        default : 'https://www.google.com/imgres?q=gojo%20profile&imgurl=https%3A%2F%2Favatarfiles.alphacoders.com%2F375%2Fthumb-1920-375543.png&imgrefurl=https%3A%2F%2Favatars.alphacoders.com%2Favatars%2Fview%2F375543&docid=g5WxqCuqOmwi-M&tbnid=QxEmdQ4Q-iWQUM&vet=12ahUKEwjVzP3H2YeGAxV_I0QIHRiBApIQM3oECDMQAA..i&w=1024&h=1024&hcb=2&ved=2ahUKEwjVzP3H2YeGAxV_I0QIHRiBApIQM3oECDMQAA'
    },
    note : {
        type : String,
        
    },
    isBlocked : {
        type :Boolean,
        default : 0
    }
},{timestamps : true})

const User = mongoose.model('user',UserSchema);

module.exports = User;