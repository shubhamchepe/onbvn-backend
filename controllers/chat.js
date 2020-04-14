var Chat = require('../models/Chat.model');
const jwt = require('jsonwebtoken');
const config = require('../config');



//Get All Chats Between Users
const GetChats = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
             Chat.find().or([{FromUser: authData.username,ToUser: req.params.touser}, {FromUser: req.params.touser, ToUser: authData.username}])
             .then(data => res.json(data)).catch(err => console.log('Error occured fetching messages...'))
          }
        });
    } catch(error){
         console.log(error);
         
    }
}






module.exports = {GetChats};