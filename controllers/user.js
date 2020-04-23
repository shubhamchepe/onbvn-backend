var User = require('../models/User.model');
var Notification = require('../models/Notification.model');
const authenticateUser = require('./auth');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require("multer");
const admin = require("../utils/fbadmin");
var bucket = admin.storage().bucket();
const uuid = require('uuid/v4');
const nodemailer = require('nodemailer');
const client = require('twilio')(config.accountSID,config.authToken)
const hbs = require('express-handlebars');
var fs = require('fs')


var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});

var upload = multer()


//Creating User
const createUser = (req,res) => {
    var newUser = new User();

    const body = JSON.parse(req.body.data);

    newUser.firstname =  body.firstname;
    newUser.lastname =  body.lastname;
    newUser.username =  body.username;
    newUser.mobileNumber = body.mobileNumber;
    newUser.email =   body.email;
    newUser.password =   body.password;
    newUser.aadharUID =   body.aadharUID;
    newUser.UserAccountStatus = 'pending'
  
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.pass
    }
});

 let HTMLFILE = fs.readFile('../views/email1.html', 'utf8', (err,data) => {
    if(err){
        return err
    }else{
        return data
    }
})

let mailOptions = {
    from: 'onbvnindia@gmail.com',
    to: body.email,
    subject: 'Account Created Successfully',
    text: 'ONBVN-Our India Social Network',
    html: HTMLFILE
};


    const params = {
        bucket: process.env.FIREBASE_BUCKET_NAME,
        fileName: req.files[0].originalname, // File name you want to save as in S3
        Body: req.files[0].buffer,
    };

    const params1 = {
        bucket: process.env.FIREBASE_BUCKET_NAME,
        fileName: req.files[1].originalname, // File name you want to save as in S3
        Body: req.files[1].buffer,
    };

    // Uploading files to the bucket
    const file = bucket.file(params.fileName);
    const file1 = bucket.file(params1.fileName)

    file.save(params.Body)
        .then(success => {
            console.log(req.files);
            console.log(req.body);
                        newUser.aadharFrontImage = `https://firebasestorage.googleapis.com/v0/b/${params.bucket}/o/${params.fileName}?alt=media`
            file1.save(params1.Body)
                .then(success => {
                    newUser.aadharBackImage = `https://firebasestorage.googleapis.com/v0/b/${params1.bucket}/o/${params1.fileName}?alt=media`
                        newUser.save((err,newUser)=>{
                        if(err){
                            console.log('error occured');
                            res.send('Could not create user')
                        } else{
                            console.log('User Created Successfully');
                            transporter.sendMail(mailOptions, (err,data) => {
                                if(err){
                                    console.log('Error Sending Email:' + err)
                                }else{
                                    console.log('Email Sent Successfully' + data)
                                }
                            })
                            res.json(newUser);

                        }
                    })
                })
                .catch(err => {
                console.error("err: " + err);
                var error = new ErrorResponse(400);
                error.errors += err;
                res.json(error);
                })
        })
        .catch(err => {
        console.error("err: " + err);
        var error = new ErrorResponse(400);
        error.errors += err;
        res.json(error);
        })
    
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
                            console.log("Updating Notifications");
                            Notification.findByIdAndUpdate(req.params.notfID, {
                                NotificationType:req.body.NotType,
                                Status:req.body.NotStatus
                            }, (err,res) => {
                                if(err){
                                    console.log("Error Updating Notifications")
                                } else{
                                    console.log('Notifications Updated!')
                                }
                            });
                        }
                    })
                }
            })
        }
    });
}

//Unfriend
const Unfriend = async (req,res) => {
    jwt.verify(req.token, config.secret , async (err, authData) => {
        if(err){
            console.log(err);
        } else {
            User.findByIdAndUpdate(authData.id, {
                $pull: {Friends:req.body.friend}
            }, (err,data) => {
                if(err){
                    console.log(err)
                } else{
                    User.findByIdAndUpdate(req.body.friend, {
                        $pull: {Friends:authData.id}
                    }, (err,data1) => {
                        if(err){
                            console.log(err)
                        } else{
                            console.log('Unfriended')
                            res.json(data1)
                        }
                    })
                }
            })
        }
    });
}

const GetOtp = async (req,res) => {
   client.verify.services(config.serviceID).verifications.create({
       to: `+91${req.params.mobile_number}`,
       channel:'sms'
   }).then((data) => {
       res.status(200).send(data)
   })
}

const VerifyOtp = async (req,res) => {
    client.verify.services(config.serviceID).verificationChecks.create({
        to: `+91${req.query.mobilenumber}`,
        code: req.query.code
    }).then((data) => {
        res.status(200).send(data)
    })
}

const ValidateUserName = async (req,res) => {
    User.find({username:req.params.username}, (err,data) => {
        if(data.length == 0){
            return res.send({message: 'Username available'})
        }else{
            return res.send({message: 'Username already exists'})
        }
    })
}

const ValidateEmail = async (req,res) => {
    User.find({email:req.params.email}, (err,data) => {
        if(data.length == 0){
            return res.send({message: 'email: OK'})
        }else{
            return res.send({message: 'Email already associated with a user'})
        }
    })
}

const ValidatePhone = async (req,res) => {
    User.find({mobileNumber:req.params.mobile}, (err,data) => {
        if(data.length == 0){
            return res.send({message: 'number: OK'})
        }else{
            return res.send({message: 'Number already associated with a user'})
        }
    })
}

const ValidateAadhar = async (req,res) => {
    User.find({aadharUID:req.params.aadhar}, (err,data) => {
        if(data.length == 0){
            return res.send({message: 'aadhaar: OK'})
        }else{
            return res.send({message: 'Aadhaar already associated with a user'})
        }
    })
}

const ImageUploadFirebase = (req,res) => {
    // const params = {
    //     Bucket: config.awsBucket,
    //     Key: req.files[0].originalname, // File name you want to save as in S3
    //     Body: req.files[0].buffer,
    // };

    // console.log(req.file);
    // console.log(req.body)
    // //Uploading files to the bucket
    // bucket.upload(req.files[0].buffer,{
    //     destination:params.Key
    // }).then(data => {
    //     console.log('File Uploaded' + JSON.stringify(data))
    //     res.status(200).json(data)
    // res.status(200).send("Hello")
    // })

    const fileBuff = req.files[0].buffer
    const fileName = req.files[0].originalname
    const mimeType = req.files[0].mimetype


    const file = bucket.file(fileName);

    file.save(fileBuff)
        .then(success => {
            console.log(JSON.stringify(success));
        res.json({
            uploaded: true,
            created_at: new Date().getTime(),
            filename: fileName,
            mimeType: mimeType,
            url: `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_BUCKET_NAME}/o/${fileName}?alt=media`
        });
        })
        .catch(err => {
        console.error("err: " + err);
        var error = new ErrorResponse(400);
        error.errors += err;
        res.json(error);
        })
};

//Update Profile Picture
const UpdateDP = (req,res) => {
    
    try{
         jwt.verify(req.token, config.secret , (err, authData) => {
            if(err){
                console.log(err);
            } else {
                console.log('Uploading DP');
                       
                                //the default schema of post in user is array but not like friends property
                                // const user = await User.findById(authData.id);
                                // user.Posts.push(data._id).then(() => res.json(data))
                                User.findByIdAndUpdate(authData.id, {
                                    profilePicture:req.body.PostImage
                                }, (err,data) => {
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('DP Updated!')
                                    }
                                })
                      
            }
        });
    } catch(error){
        console.log(error);
        
    }
    
}


module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByUsername,
    getUserByFirstname,
    UpdateFields,
    CheckIfFriends,
    AcceptFriendReq,
    upload,
    ImageUploadFirebase,
    UpdateDP,
    Unfriend,
    GetOtp,
    VerifyOtp,
    ValidateUserName,
    ValidateEmail,
    ValidatePhone,
    ValidateAadhar
};