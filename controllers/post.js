var Post = require('../models/Post.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require("multer");
const admin = require("../utils/fbadmin");
var bucket = admin.storage().bucket();



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
                var newPost = new Post();
                newPost.postImage = req.body.postImage
                newPost.postCaption = req.body.postCaption;
                newPost.user = authData.id;
                newPost.name= authData.username;
                newPost.date;
               newPost.save((err,data) => {
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

//Get All Posts Of Particular Logged In User
const GetAllPosts = async (req,res) => {
    try{
        await jwt.verify(req.token, config.secret , (err, authData) => {
            if(err){
                console.log(err);
            } else {
                Post.find({
                        "postAuthor.authorID": authData.id
            
                }).exec((err,data) => {
                    if(err){
                        console.log(err);   
                    } else {
                        res.json(data);
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
                  "postAuthor.authorUsername": Username
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
               Post.findOneAndDelete({}).where({"postAuthor.authorID": authData.id,"_id":postID}).exec((err,data) => {
                   if(err){
                       console.log(err);
                   } else{
                       res.json(`${data} DELETED!`);
                   }
               })
              
          }
        });
    } catch(error){
         console.log(error);
         
    }
}






module.exports = {CreatePost,GetAllPosts,GetAllPostsByUsername,EditPost,DeletePost,PostUpload};