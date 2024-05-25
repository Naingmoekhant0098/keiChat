const mongoose = require("mongoose");

const ChatScheme = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastMessage: {
      type: String,

      isReceived: {
        type: Boolean,
        default: 0,
      },
    },
   
  },
  { timestamps: true }
);

const Chat = mongoose.model("chat", ChatScheme);

module.exports = Chat;
