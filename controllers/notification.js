var Notification = require('../models/Notification.model');
var User = require('../models/User.model');
const authenticateUser = require('./auth');
const jwt = require('jsonwebtoken');
const config = require('../config');


//Creating Notification
const createNotification = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
       if(err){
           //res.json('Something went wrong');
           console.log(err);
       } else{
        var newNotification = new Notification();

        newNotification.FromUser =  authData.completeUser;
        newNotification.FromUserID =  authData.id;
        newNotification.FromUserFirstname =  authData.completeUser.firstname;
        newNotification.FromUserLastname =  authData.completeUser.lastname;
        newNotification.FromUserUsername =  authData.username;
        newNotification.ToUserID =  req.body.ToUserID;
        newNotification.ToUserUsername =  req.body.ToUserUsername;
        newNotification.NotificationType =  req.body.NotificationType;
        newNotification.Status =  req.body.Status;

        //This User Is The One To Whom The Notification Is Being Sent
        const user = await User.findById(req.params.ToUserID);
        //This User Is The One From Whom The Notification Is Being Sent
        const user1 = await User.findById(authData.id);

        newNotification.Notifications = user;
        newNotification.Notifications = user1;
    
        await newNotification.save((err,newNotification)=>{
           if(err){
               console.log('error occured');
               res.send('Could not create user')
           } else{
               console.log('Notification Created Successfully');
               res.json(newNotification);
               user.Notifications.push(newNotification).save();
               user1.ActivityLog.push(newNotification).save();
           }
        })
        
       }
    });
    };

//Look For Activity Log Of Signed-In User
const GetActivityLog = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
        if(err){
            //res.json('Something went wrong');
            console.log(err);
        } else{
         const user = await User.findById(authData.id).populate('ActivityLog')
         console.log('Getting Activity Of Logged In User...');
         console.log('Activity Log :',user.ActivityLog)
         res.status(200).json(user.ActivityLog)
        }
     });
} 

//Getting All Notifications
const getAllNotifications = (req,res) => {
    jwt.verify(req.token, config.secret , (err, authData) => {
       if(err){
           //res.json('Something went wrong');
           console.log(err);
       } else{
        Notification.find({})
        .exec((err,data) => {
            if(err){
                res.send('Error Occured While Fetching All Notifications')
            } else {
               res.json(data) 
            }
        })
       }
    });
    };

//Getting Notifications For Particular User
const getUserNotifications = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
        if(err){
           res.send(err)
        } else {
            console.log('Getting Users Notifications By ID');
         const user = await User.findById(authData.id).populate('Notifications')
         res.status(200).json(user.Notifications)
        }
    });
};


//Deleting Particular Notification Of User
const DeleteUserNotifications = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
        if(err){
           res.send(err)
        } else {
            console.log('Deleting Particular Notification Of User');
            ParticularNotification = req.params.id;
            await User.findByIdAndUpdate(req.body.parnot,{
                $pull: {Notifications:ParticularNotification}
             })
             console.log('Deleted Form User')
         const notification = await Notification.findByIdAndDelete(ParticularNotification)
         console.log(notification)
         res.status(200).json(notification)
        }
    });
};


module.exports = {
    createNotification,
    getAllNotifications,
    getUserNotifications,
    GetActivityLog,
    DeleteUserNotifications
};
