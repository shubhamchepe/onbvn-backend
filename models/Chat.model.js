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
    ToUser:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time:{
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
    }
  });
  

module.exports = mongoose.model('Chat',ChatSchema);