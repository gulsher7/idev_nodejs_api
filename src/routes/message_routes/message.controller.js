const MessageModel = require('../../models/message');
const ChatModel = require('../../models/chat');



const sendMessage = async (req, res) => {
    const { chatId, text,receiverId } = req.body
    try {
        const newMessage = await MessageModel.create({
            text,
            chatId,
            user: req.user.user_id
        })
        const chatUpdate = await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: text
        }, {
            new: true
        }).populate({
            path:"users",
            select:"userName",
            match: {_id: {$ne: receiverId }}
        })

        console.log("chatUpdatechatUpdate",chatUpdate)
        res.send({
            data: newMessage,
            roomData: chatUpdate,
            status: true,

        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}


const myMessages = async (req, res) => {
    const chatId = req.query.chatId

    const page = parseInt(req.query.pag3) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit 


    try {
        const messages = await MessageModel.find({
            chatId: chatId
        }).populate({
            path: "user",
            select:"userName"
        }).sort({createdAt: -1}).skip(skip).limit(limit)
        res.send({
            data: messages,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}



module.exports = {
    sendMessage,
    myMessages
}