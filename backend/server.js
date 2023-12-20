const express = require("express")
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes'); 
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes ')
const {notFound} = require('./middleware/errorMiddleware')
const cors =require('cors')


const app = express();
dotenv.config();
app.use(express.json())
app.use(cors())
// database
connectDB();


// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/message', messageRoutes)
app.use(notFound);


const server = app.listen(process.env.PORT,()=>{
    console.log(`server is live at ${process.env.PORT}`);
});


const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors:{
        origin:""
    },
});

io.on("connection",(socket)=>{
    console.log("conected to socket.io");
});