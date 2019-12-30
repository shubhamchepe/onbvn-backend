import mongoose from 'mongoose';
import config from '../config';
const connection = {}

async function connectDb(){
    if(connection.isConnected){
        console.log('Using Existing Connection')
        return;
    }
    const db = await mongoose.connect(config.env.MONGO_SRV, {
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    console.log('DB Connected!')
    connection.isConnected = db.connections[0].readyState;
}

export default connectDb;