const Message = require("../Models/MessageModel");
const Chat = require("../Models/ChatModel");
exports.addMessage = async (req, res) => {
  const { chatId, senderId, text, image } = req.body;

  const message = new Message({
    chatId,
    senderId,
    text,
    image,
  });
  try {
    const newMessage = await message.save();
    const updateLastMess = await Chat.findById(chatId);
    if (updateLastMess) {
      updateLastMess.lastMessage = text ? text : "photo";
      updateLastMess.updatedAt = new Date();
    }
    await updateLastMess.save();
    res.status(200).json({
      message: "success",
      message: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    // await Message.updateMany({chatId : req.params.chatId , isReceived : false},{$set : {isReceived : true}})
    const message = await Message.find({ chatId: req.params.chatId });

    res.status(200).json({
      message: "success",
      message,
    });
  } catch (error) {}
};

exports.updateSeen = async (req, res) => {
  try {
    const ress = await Message.updateMany(
      { chatId: req.body.chatId, isReceived: false },
      { $set: { isReceived: true } }
    );

    //   const newRes=  res.save();

    res.status(200).json(newRes);
  } catch (error) {}
};

exports.deleteMessage = async (req, res) => {
  try {
    const ress = await Message.findByIdAndDelete(req.params.id);
    const allmsg = await Message.find({ chatId: ress.chatId });
    const chtt = await Chat.findByIdAndUpdate(
      { _id: ress.chatId },
      {
        lastMessage: allmsg[allmsg.length - 1].text,
      }
    );

    const prevmsg = {
      chatId: ress.chatId,
      lastMessage: allmsg[allmsg.length - 1].text,
    };
    res.status(200).json({
      ress,
      prevmsg,
    });
  } catch (error) {}
};

exports.likeMessage = async (req, res) => {
  try {
    const isLike = await Message.findOne(
      { _id: req.body.messageId },
      {
        likes: {
          $elemMatch: {
            senderId: req.body.senderId,
            messageId: req.body.messageId,
          },
        },
      }
    );

    if (isLike.likes.length > 0) {
      isLike.likes[0] = req.body;
      await isLike.save();

      console.log("emote updated");
    } else {
      console.log("add new emote");
      await Message.updateOne(
        { _id: req.body.messageId },
        { $push: { likes: req.body } }
      );
    }

    res.status(200).json("success");
  } catch (error) {}
};
