const express = require('express');
const rootRouter = express.Router();

const users = require('./users_routes/user.route');
const posts = require('./post_routes/post.route');
const likes = require('./like_routes/like.route');
const comments = require('./comment_routes/comment.route');
const chats = require('./chat_routes/chat.route');
const messages = require('./message_routes/message.route');

rootRouter.use('/', users)
rootRouter.use('/', posts)
rootRouter.use('/', likes)
rootRouter.use('/', comments)
rootRouter.use('/', chats)
rootRouter.use('/', messages)

module.exports = rootRouter