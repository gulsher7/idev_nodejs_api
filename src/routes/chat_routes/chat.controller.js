const ChatModel = require('../../models/chat');

const createPrivateChat = async (req, res) => {
    const { userId } = req.body
    let userIds = [req.user.user_id, userId]
    try {
        const chat = await ChatModel.findOne({
            users: { $all: userIds },
            type:"private"
        })
        if (chat) {
            res.send({
                data: chat,
                status: true,
            })
            return;
        }
        const newChat = await ChatModel.create({
            users: userIds
        })
        res.send({
            data: newChat,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

const createGroupChat = async (req, res) => {
    const { userIds, chatName } = req.body
    let allUsers = userIds
    allUsers.push(req.user.user_id)
    try {
        const chat = await ChatModel.findOne({
            users: { $all: allUsers },
            type:"group"
        })
        if (chat) {
            res.send({
                data: chat,
                status: true,
            })
            return;
        }
        const newChat = await ChatModel.create({
            users: userIds,
            chatName: chatName,
            type: "group",
            groupAdmin: req.user.user_id
        })
        res.send({
            data: newChat,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

const myChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({
            users: req.user.user_id
        }).populate({
            path: "users",
            select:"userName email online lastSeen"
        }).sort({updatedAt: -1})
        res.send({
            data: chats,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

module.exports = {
    createPrivateChat,
    createGroupChat,
    myChats
}