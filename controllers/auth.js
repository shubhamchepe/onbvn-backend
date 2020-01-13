const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateUser = async (req,res) => {
    const {username, password} = req.body;
    try{
      const user = await User.findOne({username: username});
      if(password == user.password){
          const token = jwt.sign({
              id: user._id,
              username: user.username,
              completeUser: user
          }, config.secret);
          res.status(200).json({
              message: 'Login Success',
              token: token,
              id: user._id,
              user: user
          });
      }else{
        res.status(401).json({
            error: true,
            message: 'Wrong credentials entered...please try again'
        }) 
      }
    } catch(error){
         res.status(401).json({
             error: true,
             message: 'Wrong credentials entered...please try again'
         })
    }
};

verifyToken = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
       const bearer = bearerHeader.split(' ');
       const bearerToken = bearer[1];
       req.token = bearerToken;
       next();
    } else {
        res.sendStatus(403);
    }
 }



module.exports = {
    authenticateUser,
    verifyToken
};