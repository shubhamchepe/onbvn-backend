const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const {getAllUsers,
       createUser,
       getUserById,
       getUserByUsername,
       getUserByFirstname,
       UpdateFields,
       CheckIfFriends,
       AcceptFriendReq} = require('./controllers/user');
const {CreatePost,
       GetAllPosts,
       GetAllPostsByUsername,
       EditPost,
       DeletePost} = require('./controllers/post');  
const {createNotification,
       getAllNotifications,
       getUserNotifications,
       GetActivityLog,
       DeleteUserNotifications} = require('./controllers/notification');          
const {authenticateUser,verifyToken} = require('./controllers/auth');      
var db =  'mongodb+srv://shubhamchepe:132133@Shubham@cluster0-3zzun.mongodb.net/test?retryWrites=true&w=majority';


mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true,useUnifiedTopology: true });
console.log('DB Connected!'); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));


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
//Route To Create User
app.post('/createUser', createUser);
//Route To Get User By Id
app.get('/getUserById/:id', getUserById);
//Route To Get User By Username
app.get('/getUserByUsername/:username', getUserByUsername);
//Route To Get All Users By Same Firstname
app.get('/getUserByFirstname/:firstname', verifyToken, getUserByFirstname);
//Route To Authenticate User
app.post('/Auth', authenticateUser);
//Route To Update Profile Picture
app.post('/UpdateFields', verifyToken,UpdateFields)

//Delete This Route
app.get('/GetId', verifyToken,CheckIfFriends)



//Route To Create A Post
app.post('/Post', verifyToken,CreatePost);
//Route To Get All Posts Of Logged In User
app.get('/Post', verifyToken,GetAllPosts);
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


//Route To Accept Friend Request
app.post('/AcceptFriendReq',verifyToken,AcceptFriendReq);




app.listen(port, () => console.log(`Example app listening on port ${port}!`))


