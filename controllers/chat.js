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
const ModifyViewd = async (req,res) => {
    try{
         jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
             Chat.findByIdAndUpdate({_id:req.params.id},{
                 viewed:true
             }).exec((err,data) => {
                 if(err){
                     console.log(err)
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


//Get Chat Logs Of User
const GetChatLogs = async (req,res) => {
    try {
        await jwt.verify(req.token, config.secret, (err, authData) => {
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
                            "_id" : {
                                $cond: [
                                    {
                                        $gt: [
                                            { $substr: ["$ToUser", 0, 1]},
                                            { $substr: ["$FromUser", 0, 1]}
                                        ]
                                    },
                                    {$concat:["$ToUser"," and ","$FromUser"]},
                                    {$concat:["$FromUser"," and ","$ToUser"]}
                                ]
                            },
                            "message": { $first: "$$ROOT" }
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
        });
    } catch (error) {
        console.log(error);
    }
}





module.exports = {GetChats,GetChatLogs,ModifyViewd};