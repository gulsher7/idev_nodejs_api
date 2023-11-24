const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: 'https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg'
  },
  userName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: null
  },

  links: {
    type: Array,
    default: []
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  fcmToken: {
    type: String,
    default: null
  },
  validOTP: {type: Boolean, default: false},
  deviceType: {type: String, default: null},
  token: {type: String, default: null}

})

module.exports = mongoose.model("User", userSchema)



