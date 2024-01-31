
const activeUsers = {}


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected', socket.handshake.query);

    socket.on("join_room", (chatId) => {
      socket.join(chatId)
      console.log(`User ${socket.id} join chat room ${chatId}`)
    })

    socket.on("leave_room", (chatId) => {
      socket.leave(chatId)
      console.log(`User ${socket.id} leave room ${chatId}`)
    })

    socket.on("join_chat", (userId) => {
      socket.join(userId)
      console.log(`User ${socket.id} join chat ${userId}`)
    })

    socket.on("leave_chat", (userId) => {
      socket.leave(userId)
      console.log(`User ${socket.id} leave chat ${userId}`)
    })

    socket.on('is_typing', ({ roomId, userId }) => {
      io.to(roomId).emit('user_typing', { userId })
    })
    socket.on('stop_typing', ({ roomId, userId }) => {
      io.to(roomId).emit('user_stopped', { userId })
    })

    socket.on('send_message', (data) => {
      io.to(data.chatId).emit("send_message", data)
      io.to(data.userId).emit("new_chat", data.roomData)
    })


    socket.on('app_open', ({ userId }) => {
      
      activeUsers[userId] = socket.id

      io.emit('user_online', { userId, isOnline: true, activeUsers });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      if (Object.values(activeUsers).includes(socket.id)) {
        console.log(`Value ${socket.id} exists in activeUsers.`);
        console.log('++++user offline++++',socket.id);

        delete activeUsers[socket.id];
        // io.emit('user_online', { userId, isOnline: false });
    } else {
        console.log(`Value ${socket.id} does not exist in activeUsers.`);
    }
  
    })

  });

}