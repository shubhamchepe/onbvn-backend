var User = require('../models/User.model');
const authenticateUser = require('./auth');
const jwt = require('jsonwebtoken');
const config = require('../config');
const AWS = require('aws-sdk');
const fs = require('fs');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAJLIIFPP4RSF4MICA';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'onbvn-bucket';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "ap-south-1"
//     }
// };

// s3.createBucket(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });

// const uploadFile = (fileName) => {
//     // Read content from the file
//     const fileContent = fs.readFileSync(fileName);

//     // Setting up S3 upload parameters
//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: 'cat.jpg', // File name you want to save as in S3
//         Body: fileContent
//     };

//     // Uploading files to the bucket
//     s3.upload(params, function(err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(`File uploaded successfully. ${data.Location}`);
//     });
// };

//Creating User
const createUser = (req,res) => {
    var newUser = new User();

    newUser.firstname =  req.body.firstname;
    newUser.lastname =  req.body.lastname;
    newUser.username =  req.body.username;
    newUser.mobileNumber = req.body.mobileNumber;
    newUser.email =   req.body.email;
    newUser.password =   req.body.password;
    newUser.aadharUID =   req.body.aadharUID;
    newUser.aadharFrontImage =   req.body.aadharFrontImage;
    newUser.aadharBackImage =   req.body.aadharBackImage;

    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: req.body.aadharFrontImage,
        ContentType: "image/jpg"
    };

    const params1 = {
        Bucket: BUCKET_NAME,
        Key: 'cat1.jpg', // File name you want to save as in S3
        Body: req.body.aadharBackImage,
        ContentType: "image/jpg"
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        
        newUser.aadharFrontImage = data.Location

        s3.upload(params1, function(err, data1) {
            if (err) {
                throw err;
            }
            newUser.aadharBackImage = data1.Location
            newUser.save((err,newUser)=>{
                if(err){
                    console.log('error occured');
                    res.send('Could not create user')
                } else{
                    console.log('User Created Successfully');
                    res.json(newUser);
                }
            })
            console.log(`File uploaded successfully. ${data.Location}`);
            console.log(`File uploaded successfully. ${data1.Location}`);
        })
         
    });

    
    
    
};


//Getting All Users
const getAllUsers = (req,res) => {
    console.log('Finding All Users...');
    User.find({})
    .exec((err,users) => {
        if(err){
            res.send('error has occured')
        } else{
            console.log('Got It.');
            res.json(users)
        }
    })
};

//Get User By Id
const getUserById = (req,res) => {
    console.log('Getting User by Id');
    User.findById({
        _id:req.params.id
    }, (err,user) =>{
        if(err){
            console.log('Error Occured!');
            res.send('Error Occured');
        } else {
            console.log('Got It');
            res.json(user);
        }
    })
};

//Get User By Username
const getUserByUsername = (req,res) => {
    console.log('Getting User By Username');
    User.find({
        username:req.params.username
    }, (err,user) =>{
        if(err){
            console.log('Error Occured');
            res.send('Something Went Wrong');
        } else{
            console.log('Got It!');
            res.json(user);
        }
    })
};

//Get User By Firstname
const getUserByFirstname = (req,res) => {
    jwt.verify(req.token, config.secret , (err, authData) => {
        if(err){
           res.send(err)
        } else {
            console.log('Getting User By Firstname');
    User.find({
        firstname:req.params.firstname
    }, (err,user) =>{
        if(err){
            console.log('Error Occured');
            res.send('Something Went Wrong');
        } else{
            console.log('Got It!');
            res.json(user);
            console.log(authData)
        }
    });
        }
    });
};

//User Can Update Any Fields From This Route
const UpdateFields = (req,res) => {
 jwt.verify(req.token, config.secret , (err, authData) => {
    if(err){
        //res.json('Something went wrong');
        console.log(err);
    } else{
        User.findByIdAndUpdate(authData.id, {
            city:req.body.city,
            state:req.body.state,
            link1:req.body.link1,
            link2:req.body.link2,
            BIO:req.body.BIO,
            SOP:req.body.SOP,
            Company:req.body.Company,
            BrandUserLoves:req.body.BrandUserLoves,
            Hobby:req.body.Hobby,
        }, (err,data) => {
            if(err){
                console.log(err)
            } else{
                res.json(data);
            }
        })
    }
 });
 };


//Check If Friends
const CheckIfFriends = async (req,res) => {
    jwt.verify(req.token, config.secret , (err, authData) => {
        if(err){
            console.log(err);
        } else {
            username = req.body.username;
            User.find({username},(err,data) => {
                if(err) throw err;
                else{
                    //ye logged in user ka data hey
                    //console.log(authData.completeUser.Friends.id);
                    //ye searched user ka data hey
                    //res.json({yepuradata:data[0].Friends.id});
                    function contains(SearchedUser, LoggedInUser) {
                        for (var i = 0; i < SearchedUser.length; i++) {
                            if (SearchedUser[i] === LoggedInUser) {
                                return res.json('FRIENDS');
                            }
                        }
                        return res.json('NOT FRIENDS');
                    }
                    SearchedUser = data[0].Friends.id;
                    LoggedInUser = authData.id;
                    contains(SearchedUser, LoggedInUser);
                }
            })
        }
    });
}

//Accept Friend Request
const AcceptFriendReq = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
        if(err){
            console.log(err);
        } else {
            User.findByIdAndUpdate(authData.id, {
                $push: {Friends:req.body.friend}
            }, (err,data) => {
                if(err){
                    console.log(err)
                } else{
                    User.findByIdAndUpdate(req.body.friend, {
                        $push: {Friends:authData.id}
                    }, (err,data1) => {
                        if(err){
                            console.log(err)
                        } else{
                            res.json(data)
                        }
                    })
                }
            })
        }
    });
}



module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByUsername,
    getUserByFirstname,
    UpdateFields,
    CheckIfFriends,
    AcceptFriendReq
};