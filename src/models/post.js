const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const mediaSchema = new mongoose.Schema({
    type: {type: String, enum: ['image', 'video'], required: false}
})

const postSchema = new mongoose.Schema({
media: [mediaSchema],
description: {type: String},
userId: {type: ObjectId, required: true, ref: 'User'},
likeCount: {type: Number, default: 0},
commentCount: {type: Number, default: 0},
},{timestamps: true})

module.exports = mongoose.model("Post", postSchema)



