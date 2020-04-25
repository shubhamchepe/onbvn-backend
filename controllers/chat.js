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

//Modify viewed status
// const ModifyViewd = async (req,res) => {
//     try{
//         await jwt.verify(req.token, config.secret , (err, authData) => {
//           if(err){
//               console.log(err);
//           } else{
//              Chat.findByIdAndUpdate()
//           }
//         });
//     } catch(error){
//          console.log(error);
         
//     }
// }

//Get Chat Logs Of User
const GetChatLogs = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
            Chat.aggregate(
              [
                  // Matching pipeline, similar to find
                  { 
                      "$match": { 
                        "$or":[{"FromUser": authData.username},{"ToUser": authData.username}]
                      }
                  },
                  // Sorting pipeline
                  { 
                      "$sort": { 
                          "createdAt": -1 
                      } 
                  },
                  // Grouping pipeline
                  {
                      "$group": {
                          "_id" : "$_id",
                          "FromUser":"$FromUser",
                          "ToUser":"$ToUser",
                          "message":"$message",
                          "createdAt":"$createdAt",
                          "viewed":"$viewed"
                        
                        //   "ToUser": {
                        //      "$first": "$ToUser"
                        //   },
                        //   "ToUserID": {
                        //     "$first": "$ToUserID"
                        //  },
                        //   "message": {
                        //       "$first": "$message" 
                        //   },
                        //   "createdAt": {
                        //       "$last": "$createdAt" 
                        //   },
                        //   "viewed": {
                        //     "$first": "$viewed" 
                        // }
                      }
                  },
                  // Project pipeline, similar to select
                //   {
                //        "$project": { 
                //           "_id": 0,
                //           "FromUser": "$_id",
                //           "ToUser": "$ToUser",
                //           "ToUserID": "$ToUserID",
                //           "message": "$message",
                //           "createdAt": "$createdAt",
                //           "viewed": "$viewed"
                //       }
                //   }
              ],
              function(err, messages) {
                 // Result is an array of documents
                 if (err) {
                      console.log(err)
                  } else {
                      res.json(messages)
                  }
              }
          );
          }
        });
    } catch(error){
         console.log(error);
         
    }
}





module.exports = {GetChats,GetChatLogs};