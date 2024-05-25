const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema({
    chatId : {
        type : String,
    },
    senderId : {
        type : String
    },
    text : {
        type :String
    },
    image: {
        type :String
    },
    isReceived : {
        type :Boolean,
        default :0,
    },
    likes : {
        type : Array,
        default : [],
    }
},{timestamps : true})

const Message = mongoose.model('message',MessageSchema);
module.exports = Message;