const router = require('express').Router();
const {createChat,userChat,findChat} = require('../Controllers/chatController')
 
router.post('/',createChat)
router.get('/:userId',userChat)
router.get('/findChat/:firstUId/:secondUId',findChat)

module.exports = router;