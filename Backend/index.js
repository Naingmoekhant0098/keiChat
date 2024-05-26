const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app= express();
const http =require('http')
const chatRouter = require('./routers/chatRouter')
const messageRouter = require('./routers/messageRouter')
const authRouter = require('./routers/authRouter')
const {connect} = require('./Db/db')
require('dotenv').config();
const path = require('path')
app.use(cookieParser())
app.use(cors({
    origin : ['http://localhost:5173','https://keichat-6.onrender.com'],
    credentials : true,
}))

const __dir = path.resolve();
 
const sever = http.createServer(app)
 
 
const io = require("socket.io")(sever, {
    cors: {
      origin: ['http://localhost:5173','https://keichat-6.onrender.com'],
    },
  });
  
  let activeUsers = [];
  
  io.on("connection", (socket) => {
    console.log('sever is connected')
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id,
        });
      }
      console.log("Connected user", activeUsers);
      io.emit("get-users", activeUsers);
    });
  
  
    socket.on("markMessageSeen",(data)=>{
      const user = activeUsers.find((u) => u.userId === data.senderId);
      if(user){
        io.to(user.socketId).emit('asSeen',data)
      }
    })
   
    socket.on("send-delete-message", (data) => {
  
      const { receiverId } = data;
      const user = activeUsers.find((u) => u.userId === receiverId);
       
      if (user) {
        io.to(user.socketId).emit("Deletemessage", data);
      }
      // else{
      //   io.emit("receive-message", data);
      // }
    });
    socket.on('send-react-message',(data)=>{
      
      const user = activeUsers.find((u)=>u.userId === data.receiverId);
      if(user){
        io.to(user.socketId).emit('sendReceiveReact',data);
      }
    })
  
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((u) => u.userId === receiverId);
       
      if (user) {
        io.to(user.socketId).emit("receive-message", data);
      }
      // else{
      //   io.emit("receive-message", data);
      // }
    });
    socket.on("typing", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((u) => u.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("sendTyping", data);
      }
    });
    socket.on("not-typing", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((u) => u.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("sendnotTyping", data);
      }
    });
  
  
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
  
 
connect();
app.use(express.json());
app.use('/auth',authRouter)
app.use('/chat',chatRouter);
app.use('/message',messageRouter);
app.use(express.static(path.join(__dir,'client/dist')))
app.use('*',(req,res)=>{
    res.sendFile(path.join(__dir,'client','dist','index.html'))
})
 
sever.listen(4000,()=>{
    console.log('Sever is running at port 4000')
})