var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendRequestSchema = new Schema({
    FromId: String,
    ToId: String,
    //Friend Type Is Something The Is Selected By User Who Is Sending Friend Request
    //Like "Langoti Yarr","Colony Friends","Work Mates"...etc
    //onbvn asks user who is sening request,that...who is he of yours..?!
    FriendType: String,
    accepted: Boolean
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);