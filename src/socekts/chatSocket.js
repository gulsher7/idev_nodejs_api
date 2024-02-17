
const UserModel = require('../models/user');
const socktIdToUserId = new Map();

const {firebase} = require('../firebase/index')

module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on("join_room", (chatId) => {
      socket.join(chatId)
      console.log(`User ${socket.id} join room ${chatId}`)
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

      console.log("send_message", data.userId)
      io.to(data.chatId).emit("send_message", data)
      io.to(data.userId).emit("new_chat", data.roomData)
      sendNotification(data)

    })

    socket.on('user_online', async ({ userId }) => {
      try {
        const user = await UserModel.findById(userId)
        if (user) {
          user.online = true;
          await user.save();
          socktIdToUserId.set(socket.id, userId)
          io.emit('user_online', { userId: user._id, online: true })
          console.log(userId, "+++user online success++++")
        }
      } catch (error) {
        console.log("error updating user status:", error)
      }
    })

    socket.on('disconnect', async () => {
      console.log('Socket disconnected');
      const userId = socktIdToUserId.get(socket.id)
      if (userId) {
        try {
          const user = await UserModel.findById(userId)
          if (user) {
            user.online = false,
              user.lastSeen = new Date();
            await user.save();
            io.emit('user_online', { userId: user._id, online: false, lastSeen: user.lastSeen })
            console.log('user disconnected succesfully...!');
          }
        } catch (error) {

        }
      }
    })

  });
}


const sendNotification = async(notificationData) =>{
  console.log("notification data received",notificationData)

  try {
    let findUser = await UserModel.findById(notificationData?.userId)

    console.log("findUserfindUser",findUser)
    if(!!findUser?.fcmToken){

      let notificationPayload = {
        roomId: notificationData?.chatId,
        roomName: findUser.userName,
        receiverIds: notificationData?.userId,
        type: notificationData.roomData.type
    }

      let res = await firebase.messaging().send({
        token: findUser?.fcmToken,
        notification: {
          title:"New Message",
          body: notificationData.text,
        },
        data: {
          notification_type: "chat",
          navigationId:'messages',
          data: JSON.stringify(notificationPayload)
        }
      })
      console.log("notification send successfully...!!!!",res)
    }

  } catch (error) {
    console.log("notification failed",error)
  }
}