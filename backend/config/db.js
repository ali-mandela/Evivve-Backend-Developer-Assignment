const mongoose = require('mongoose');


const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected database to : ${conn.connection.host}`);
    }catch(err){
        console.log(`error`,err);
        process.exit();
    }
}
module.exports = connectDB;