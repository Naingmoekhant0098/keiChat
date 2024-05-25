const io = require("socket.io")(8800, {
  cors: {
    origin: ['http://localhost:5173','https://keichat-6.onrender.com'],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
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
    console.log(data)
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
