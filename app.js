require("dotenv/config")

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
//var server = require('http').Server(app);
//var io = require('socket.io')(server);
const port = process.env.PORT ||3000;
//server.listen(port-1);
const {getAllUsers,
       createUser,
       getUserById,
       getUserByUsername,
       getUserByFirstname,
       UpdateFields,
       CheckIfFriends,
       upload,
       AcceptFriendReq,
       ImageUploadFirebase,
       UpdateDP,
       Unfriend,
       GetOtp,
       VerifyOtp,
       ValidateUserName,
       ValidateEmail,
       ValidatePhone,
       ValidateAadhar} = require('./controllers/user');
const {CreatePost,
       GetAllPosts,
       GetAllPostsByUsername,
       EditPost,
       DeletePost,
       PostUpload,
       GetAllPostsOfUser} = require('./controllers/post');  
const {createNotification,
       getAllNotifications,
       getUserNotifications,
       GetActivityLog,
       DeleteUserNotifications,
       UpdateUserNotification} = require('./controllers/notification');    
const {GetChats,GetChatLogs,ModifyViewd,ClearChatCollection} = require('./controllers/chat');             
const {authenticateUser,verifyToken} = require('./controllers/auth'); 
const connectDb = require('./utils/connectDb');     

connectDb();
// cors origin URL - Allow inbound traffic from origin
corsOptions = {
       origin: "https://onbvn-backend.herokuapp.com",
       optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
     };
     app.use(cors(corsOptions));
// mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true,useUnifiedTopology: true });
// console.log('DB Connected!'); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));
// var Chat = require('./models/Chat.model');
// var users = [];
// users.length = 2;


{/*
                  888                              888                        888                             888 
                  888                              888                        888                             888 
                  888                              888                        888                             888 
 .d88b.  88888b.  88888b.  888  888 88888b.        88888b.   8888b.   .d8888b 888  888  .d88b.  88888b.   .d88888 
d88""88b 888 "88b 888 "88b 888  888 888 "88b       888 "88b     "88b d88P"    888 .88P d8P  Y8b 888 "88b d88" 888 
888  888 888  888 888  888 Y88  88P 888  888       888  888 .d888888 888      888888K  88888888 888  888 888  888 
Y88..88P 888  888 888 d88P  Y8bd8P  888  888       888 d88P 888  888 Y88b.    888 "88b Y8b.     888  888 Y88b 888 
 "Y88P"  888  888 88888P"    Y88P   888  888       88888P"  "Y888888  "Y8888P 888  888  "Y8888  888  888  "Y88888 
 
 
  ▄▄▄▄ ▓██   ██▓     ██████  ██░ ██  █    ██  ▄▄▄▄    ██░ ██  ▄▄▄       ███▄ ▄███▓        ▄████  ▒█████   █    ██ ▄▄▄█████▓ ▄▄▄       ███▄ ▄███▓
▓█████▄▒██  ██▒   ▒██    ▒ ▓██░ ██▒ ██  ▓██▒▓█████▄ ▓██░ ██▒▒████▄    ▓██▒▀█▀ ██▒       ██▒ ▀█▒▒██▒  ██▒ ██  ▓██▒▓  ██▒ ▓▒▒████▄    ▓██▒▀█▀ ██▒
▒██▒ ▄██▒██ ██░   ░ ▓██▄   ▒██▀▀██░▓██  ▒██░▒██▒ ▄██▒██▀▀██░▒██  ▀█▄  ▓██    ▓██░      ▒██░▄▄▄░▒██░  ██▒▓██  ▒██░▒ ▓██░ ▒░▒██  ▀█▄  ▓██    ▓██░
▒██░█▀  ░ ▐██▓░     ▒   ██▒░▓█ ░██ ▓▓█  ░██░▒██░█▀  ░▓█ ░██ ░██▄▄▄▄██ ▒██    ▒██       ░▓█  ██▓▒██   ██░▓▓█  ░██░░ ▓██▓ ░ ░██▄▄▄▄██ ▒██    ▒██ 
░▓█  ▀█▓░ ██▒▓░   ▒██████▒▒░▓█▒░██▓▒▒█████▓ ░▓█  ▀█▓░▓█▒░██▓ ▓█   ▓██▒▒██▒   ░██▒      ░▒▓███▀▒░ ████▓▒░▒▒█████▓   ▒██▒ ░  ▓█   ▓██▒▒██▒   ░██▒
░▒▓███▀▒ ██▒▒▒    ▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒░▒▓▒ ▒ ▒ ░▒▓███▀▒ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ░  ░       ░▒   ▒ ░ ▒░▒░▒░ ░▒▓▒ ▒ ▒   ▒ ░░    ▒▒   ▓▒█░░ ▒░   ░  ░
▒░▒   ░▓██ ░▒░    ░ ░▒  ░ ░ ▒ ░▒░ ░░░▒░ ░ ░ ▒░▒   ░  ▒ ░▒░ ░  ▒   ▒▒ ░░  ░      ░        ░   ░   ░ ▒ ▒░ ░░▒░ ░ ░     ░      ▒   ▒▒ ░░  ░      ░
 ░    ░▒ ▒ ░░     ░  ░  ░   ░  ░░ ░ ░░░ ░ ░  ░    ░  ░  ░░ ░  ░   ▒   ░      ░         ░ ░   ░ ░ ░ ░ ▒   ░░░ ░ ░   ░        ░   ▒   ░      ░   
 ░     ░ ░              ░   ░  ░  ░   ░      ░       ░  ░  ░      ░  ░       ░               ░     ░ ░     ░                    ░  ░       ░   
      ░░ ░                                        ░                                                                                            
                                                                                                                  
*/}

app.get('/', (req, res) => res.send('Welcome to onbvn backend'));

//Route To Get All Users
app.get('/getAllUsers', getAllUsers);
//Validate Username
app.get('/ValidateUsername/:username', ValidateUserName);
//Validate Email
app.get('/ValidateEmail/:email', ValidateEmail);
//Validate Phone
app.get('/ValidateMobile/:mobile', ValidatePhone);
//Validate AadharUID
app.get('/ValidateAadhar/:aadhar', ValidateAadhar);
//Route To Create User
app.post('/createUser', upload.any(),createUser);
//Get OTP For Client From Twilio
app.get('/GetOtp/:mobile_number', GetOtp);
//Verify OTP For Client From Twilio
app.get('/VerifyOtp', VerifyOtp);
//Route To Get User By Id
app.get('/getUserById/:id', getUserById);
//Route To Get User By Username
app.get('/getUserByUsername/:username', getUserByUsername);
//Route To Get All Users By Same Firstname
app.get('/getUserByFirstname/:firstname', verifyToken, getUserByFirstname);
//Route To Authenticate User
app.post('/Auth', authenticateUser);
//Route To Update Profile Picture
app.post('/UpdateFields', verifyToken,UpdateFields);
//Route To Update DP
app.post('/UpdateDP', upload.any(),verifyToken,UpdateDP);
//Route To Unfriend
app.post('/Unfriend',verifyToken,Unfriend);
//Delete This Route
app.get('/GetId', verifyToken,CheckIfFriends)



//Route To Create A Post
app.post('/Post', PostUpload.any(),verifyToken,CreatePost);
//Route To Get All Posts Of Users Friends
app.get('/Post', verifyToken,GetAllPosts);
//Route To Get All Posts Of Users
app.get('/MyPost', verifyToken,GetAllPostsOfUser);
//Route To Get All Posts Of Other User When Searched By Username
app.get('/Post/:username', verifyToken,GetAllPostsByUsername);
//Route To Edit Caption Of Particular Post Of Logged In User
app.post('/Post/:id', verifyToken,EditPost);
//Route To Delete Post Of Logged In User
app.post('/Post/delete/:id', verifyToken,DeletePost);


//Route To Create Notification
app.post('/Notifications/:ToUserID',verifyToken,createNotification);
//Route To Get All Notifications
app.get('/Notifications',verifyToken,getAllNotifications);
//Route To Get Notifications Of User By Username
app.get('/Notifications/ofuser',verifyToken,getUserNotifications);
//Route To Get Activity Log Of Signed In User
app.get('/ActivityLog/ofuser',verifyToken,GetActivityLog);
//Route To Delete Particular Notification Of Signed In User By Id
app.post('/DeleteNotification/:id',verifyToken,DeleteUserNotifications);
app.post('/UpdateNotification/:id',verifyToken,UpdateUserNotification);



//Route To Accept Friend Request
app.post('/AcceptFriendReq/:notfID',verifyToken,AcceptFriendReq);

app.post('/fbupload',upload.any(),ImageUploadFirebase);


//Route To Fetch Chats Between Users
app.get('/getchats/:touser', verifyToken,GetChats);
//Route To Get Chat Logs
app.get('/getchatlogs',verifyToken,GetChatLogs);
//Modify Viewed status
app.post('/ModifyStatus/:id',ModifyViewd);
//Clear Chat Collection
app.get('/DelETe_Chhats',ClearChatCollection)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


