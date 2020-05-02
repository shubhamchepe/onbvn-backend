var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const ChatSchema = new Schema({
    ConvoBetween:{
        type: String,
        required: true
    },
    FromUser:{
        type: String,
        required: true
    },
    FromUserID:{
       type: String,
       required: true
    },
    FromUserDP:{
        type: String,
     },
    ToUser:{
        type: String,
        required: true
    },
    ToUserID:{
        type: String,
        required: true
    },
    createdAt:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    viewed:{
        type: Boolean
    },
    underscoreID:{
        type: mongoose.Types.ObjectId
    }
  }, { autoIndex: false });
  

module.exports = mongoose.model('Chat',ChatSchema);