var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./User.model')

var PostSchema = new Schema({
    postUrl: {
        type: String,
        required: true,
        default:''
    },
    postCaption: String,
    //userID => The One Who Liked
    postLikes: [],
    postComments: [{comment: String, date: Date,commentedBy: String}],
    postCommentCount:[],
    postAuthor: {authorID:String,authorUsername:String},
    postDate: {
        type: Date, 
        default: Date.now
    },
    postLocation:{
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Post',PostSchema);