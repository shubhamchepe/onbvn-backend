var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    FromUser: {},
    FromUserID: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    FromUserFirstname: {
        type:String
    },
    FromUserLastname: {
        type:String
    },
    FromUserUsername: {
        type:String
    },
    ToUserID:{
        type:String
    },
    ToUserUsername:{
        type:String
    },
    Date:{
    type:Date
    },
    NotificationType:{
        type:String
    },
    Status:{
        type:Boolean
    }
}, {
    timestamps:true
});

module.exports = mongoose.model('Notification', NotificationSchema);