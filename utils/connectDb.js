const mongoose = require('mongoose');
const config  = require('../config');
const connection = {}

async function connectDb(){
    if(connection.isConnected){
        console.log('Using Existing Connection')
        return;
    }
    const db = await mongoose.connect(config.mongoURL, {
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    console.log('DB Connected!')
    connection.isConnected = db.connections[0].readyState;
}
module.exports = connectDb;