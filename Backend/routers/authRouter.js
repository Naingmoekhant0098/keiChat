const router = require('express').Router();
const {logInGoogle,getUser,getUsers} = require('../Controllers/authController')
router.post('/',logInGoogle)
router.get('/getUser/:id',getUser)
router.get('/getUsers',getUsers)
module.exports = router