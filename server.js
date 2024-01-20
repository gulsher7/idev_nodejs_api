if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const { Server } = require("socket.io");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const http = require('http')
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./src/confiidg/database');
const my_routes = require('./src/routes');

app.get('/', (req, res) => {
  res.send('Hello, Express');
});

app.use('/', my_routes)


io.on('connection', (socket) => {
  console.log('a user connected',socket.id);


  socket.on("leave_room", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left room ${chatId}`);
  });


  socket.on("leave_chat", (userId) => {
    socket.leave(userId);
    console.log(`User ${socket.id} left room ${userId}`);
  });

  socket.on("join_chat", (userId)=>{
    socket.join(userId)
    console.log(`User ${socket.id} joined chat room ${userId}`)
  })

  socket.on("join_room", (chatId)=>{
    socket.join(chatId)
    console.log(`User ${socket.id} joined chat room ${chatId}`)
  })

  socket.on('send_message',(data)=>{
    io.to(data.chatId).emit("send_message",data)
    io.to(data.userId).emit('new_chat',data.upatedRoom)
  })

  socket.on('disconnect', ()=>{
    console.log("user disconnect")
  })

});


server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
