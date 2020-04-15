var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
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
    profilePicture: {
        type: String,
        default: ''
    },
    aadharUID: {
        type: String,
        required: true,
        unique: true
    },
    aadharFrontImage: {
        type: String
    },
    aadharBackImage: {
        type: String
    },
    profileBackground: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state:{
        type: String,
        default: ''
    },
    DOB: {
        type: String,
        default: ''
    },
    link1: {
        type: String,
        default:''
    },
    link2: {
        type: String,
        default: ''
    },
    BIO: {
        type: String,
        default: ''
    },
    //Student Or Professional?
    SOP: {
        type: String,
        default: ''
    },
    Company: {
        type: String,
        default:''
    },
    School: {
        type: String,
        default:''
    },
    //Schooling From Year
    SFY: {
      type: String,
      default:''
    },
    //Schooling Till Year
    STY: {
      type: String,
      default:''
    },
    College: {
        type: String,
        default:''
    },
     //College From Year
     CFY: {
        type: String,
        default:''
      },
      //College Till Year
      CTY: {
        type: String,
        default:''
      },
      BrandUserLoves:[],
      Hobby:[],
      Friends: {
         type:[mongoose.Types.ObjectId]
      },
      ColonyFriends: {
          type: [],
          default: ''
      },
      LangotiYars: {
          type: [],
          default: ''
      },
      FemaleFriends: {
          type: [],
          default:''
      },
      GuyFriends: {
        type: [],
        default:''
      },
      GirlFriend: {
          type: [0],
          default:'',
      },
    //   Posts: [{
    //     type:Schema.Types.ObjectId,
    //     ref:'Post'
    //   }],
      Posts: {
        type:[{type:Schema.Types.ObjectId, ref:'Post'}]
      },
      aadharFrontImage:{
         type: String,
         default:''
      },
      aadharBackImage:{
        type: String,
        default:''
     },
      Notifications:[{
          type:Schema.Types.ObjectId,
          ref:'Notification'
      }],
      ActivityLog:[{
          type:Schema.Types.ObjectId,
          ref:'Notification'
      }]
});

module.exports = mongoose.model('User',UserSchema);