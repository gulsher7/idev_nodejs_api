const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const chatSchema = new mongoose.Schema({
chatName: {type: String},
type: {
    type: String,
    enum: ["private","group"],
    default: "private"
},
users: [{type: ObjectId, required: true, ref: 'User', required: true}],
latestMessage: {type: {}, ref:"User"},
groupAdmin: {type: ObjectId, ref: 'User'}

},{timestamps: true})

module.exports = mongoose.model("Chat", chatSchema)



