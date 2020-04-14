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
             Chat.find({FromUser: authData.username,ToUser: req.params.touser}, (err,data) => {
                 if(err){
                     console.log('Error In Getting Chat Messages')
                 }else{
                     res.json(data)
                 }
             })
              
          }
        });
    } catch(error){
         console.log(error);
         
    }
}






module.exports = {GetChats};