const Chat = require("../Models/ChatModel");
exports.createChat = async (req, res) => {
  try {
    const chat = new Chat({
      members: [req.body.senderUId, req.body.receiverUId],
    });

    const findChat = await Chat.findOne({
      members: { $all: [req.body.senderUId, req.body.receiverUId] },
    });
    if (findChat) {
      
      res.status(200).json({
        message: "Created",
        chat: findChat,
      });
    } else {
      
      const returnChat = await chat.save();
      res.status(200).json({
        message: "Created",
        chat: returnChat,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.findChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstUId, req.params.secondUId] },
    });

    res.status(200).json({
      chat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.userChat = async (req, res) => {
  try {
    console.log(req.query.username)
    const user = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
 