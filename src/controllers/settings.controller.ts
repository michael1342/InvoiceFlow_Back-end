const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   transaction: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Transaction',
       required: true
   },
   isRead: {
       type: Boolean,
       default: false
   }
})

module.exports = mongoose.model('Notification', NotificationSchema)