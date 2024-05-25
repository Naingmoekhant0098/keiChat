const router = require("express").Router();
const { addMessage, getMessage ,updateSeen,deleteMessage,likeMessage} = require("../Controllers/messageController");

router.post("/",addMessage);
router.get("/:chatId",getMessage);
router.put('/updateSeen',updateSeen)
router.get('/deleteMessage/:id',deleteMessage)
router.put('/likeMessage',likeMessage)

module.exports = router;
