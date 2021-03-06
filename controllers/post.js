var Post = require('../models/Post.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require("multer");
const admin = require("../utils/fbadmin");
var bucket = admin.storage().bucket();
var User = require('../models/User.model');
var mongoose = require('mongoose');



var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});

var PostUpload = multer()

//Create Post
const CreatePost = (req,res) => {
    
    try{
         jwt.verify(req.token, config.secret , (err, authData) => {
            if(err){
                console.log(err);
            } else {
                console.log('Posting...');
                console.log(authData)
                var newPost = new Post();
                 console.log(req.body.PostCaption);
                 
                newPost.postCaption = req.body.PostCaption;
                newPost.postImage = req.body.PostImage;
                newPost.user = authData.id;
                newPost.name= authData.username;
                newPost.avatar = req.body.Avatar;
                newPost.date;

                        newPost.save(async (err,data) => {
                            if(err){
                                console.log(err);
                            } else{
                                //the default schema of post in user is array but not like friends property
                                // const user = await User.findById(authData.id);
                                // user.Posts.push(data._id).then(() => res.json(data))
                                User.findByIdAndUpdate(authData.id, {
                                    $push: {Posts:data._id}
                                }).then(() => res.json(data))
                            }
                        })
             
        .catch(err => {
        console.error("err: " + err);
        var error = new ErrorResponse(400);
        error.errors += err;
        res.json(error);
        })
            }
        });
    } catch(error){
        console.log(error);
        
    }
    
}

//Get All Posts Of Users Friends
const GetAllPosts = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
            if(err){
                console.log(err);
            } else {
                  let array = authData.completeUser.Friends;
                  array.push(authData.completeUser._id) 
                 Post.find({ "user": { "$in": array } }).exec((err,data) => {
                     if(err){
                         res.json(err)
                     }else{
                         return res.json(data)
                     }
                 })
            }
        });

    } catch(error){
        console.log(error);
    }
}

//Get All Posts Of Logged In User
const GetAllPostsOfUser = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
            if(err){
                console.log(err);
            } else {
                Post.find({user:authData.id}).exec((err,data) => {
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

//Get All Posts Of Particular User When Searched For Username
const GetAllPostsByUsername = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
              Username = req.params.username
              Post.find({
                  name: Username
              }).exec((err,data) => {
                  if(err){
                      console.log(err);
                  } else{
                      res.json(data);
                  }
              })
          }
        });
    } catch(error){
         console.log(error);
         
    }
}


//Edit Caption Of Posts Only If Authorized
const EditPost = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
               postCaption = req.body.caption;
               postID = req.params.id;
               Post.findOneAndUpdate({postCaption}).where({"postAuthor.authorID": authData.id,"_id":postID}).exec((err,data) => {
                   if(err){
                       console.log(err);
                   } else{
                       res.json(data);
                   }
               })
              
          }
        });
    } catch(error){
         console.log(error);
         
    }
}


//Delete Post Of Authorized User
const DeletePost = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
          if(err){
              console.log(err);
          } else{
               postID = req.params.id;
               Post.findOneAndDelete({_id:postID}).exec((err,data) => {
                   if(err){
                       console.log(err);
                   } else{
                       User.findByIdAndUpdate(authData.id, {
                        $pull: {Posts:postID}
                       }, (err,data) => {
                           if(err){
                               console.log('Error In Deleting Post')
                           } else{
                               console.log('Post Deleted Successfully...')
                           }
                       })
                   }
               })
              
          }
        });
    } catch(error){
         console.log(error);
         
    }
}






module.exports = {CreatePost,GetAllPosts,GetAllPostsByUsername,EditPost,DeletePost,PostUpload,GetAllPostsOfUser};