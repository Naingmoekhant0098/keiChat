const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app= express();
const chatRouter = require('./routers/chatRouter')
const messageRouter = require('./routers/messageRouter')
const authRouter = require('./routers/authRouter')
const {connect} = require('./Db/db')
require('dotenv').config();
const path = require('path')
app.use(cookieParser())
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
}))

const __dir = path.resolve();
 
connect();
app.use(express.json());
app.use('/auth',authRouter)
app.use('/chat',chatRouter);
app.use('/message',messageRouter);
app.use(express.static(path.join(__dir,'/client')))
app.use('*',(req,res)=>{
    res.sendFile(path.join(__dir,'/client/index.html'))
})
console.log(path.join(__dir,'/client'))
app.listen(4000,()=>{
    console.log('Sever is running at port 4000')
})