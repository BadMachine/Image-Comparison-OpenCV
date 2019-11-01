const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sessionToken: {
        type: String,
        unique: true
    },
    status: {
          type: Boolean,
          isOnline: false
    },
    rights:{
        type: Boolean,
        isAdmin: false
    },
    sessionToken: {
         type: String
    },
    lastSeen: {
        type: Date
    }

});
module.exports = mongoose.model('users', UserSchema);