require("dotenv/config")

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = process.env.PORT ||3000;
server.listen(port+1);
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
       UpdateDP,Unfriend} = require('./controllers/user');
const {CreatePost,
       GetAllPosts,
       GetAllPostsByUsername,
       EditPost,
       DeletePost,
       PostUpload} = require('./controllers/post');  
const {createNotification,
       getAllNotifications,
       getUserNotifications,
       GetActivityLog,
       DeleteUserNotifications,
       UpdateUserNotification} = require('./controllers/notification');          
const {authenticateUser,verifyToken} = require('./controllers/auth'); 
const connectDb = require('./utils/connectDb');     
var db =  'mongodb+srv://shubhamchepe:132133@Shubham@cluster0-3zzun.mongodb.net/test?retryWrites=true&w=majority';
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
var Chat = require('./models/Chat.model');
var users = [];
users.length = 2;


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
app.post('/createUser', upload.any(),createUser);
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


// io.on('connection', socket => {
//        console.log(socket.id);
//        socket.on('Chat Message', msg => {
//               console.log(msg);
//        io.emit('Chat Message', msg)
//        });
// })

io.configure(function () { 
       io.set("transports", ["xhr-polling"]); 
       io.set("polling duration", 10); 
     });

io.on('connection', (socket) => {
       console.log("User connected", socket.id);

       socket.on('user_connected', (username) => {
              console.log("Username :" + username);
              users[username] = socket.id;
              console.log(users);

       io.emit('user_connected', username);   

       socket.on('send_message', (data) => {
             var socketId = users[data.ToUser];
             var socketId1 = users[data.FromUser];
             io.to(socketId1).emit('new_message', data)
             var chat = new Chat(data)
             chat.save((err,data) => {
                    if(err){
                           console.log('Error Occured Saving Chat')
                    } else{
                           console.log('Chat Saved')
                    }
             })
             console.log(data);
             data.type = 'in'
             io.to(socketId).emit('new_message', data)
       })    
       })
})


//Route To Create A Post
app.post('/Post', PostUpload.any(),verifyToken,CreatePost);
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
app.post('/UpdateNotification/:id',verifyToken,UpdateUserNotification);



//Route To Accept Friend Request
app.post('/AcceptFriendReq/:notfID',verifyToken,AcceptFriendReq);

app.post('/fbupload',upload.any(),ImageUploadFirebase);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


