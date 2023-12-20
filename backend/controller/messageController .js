const asyncHandler = require('express-async-handler');
const messageModel = require('../models/messageModel'); 
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const sendMessageController = asyncHandler(async(req,res)=>{

    const {content,chatId} = req.body;
    if (!content || !chatId ) {
        res.status(400).send({message :"no chat id amd content"}) ;
    }

    let newMessage = {
        sender : req.user.id,
        content:content,
        chat:chatId
    };

    try{
        var message = await messageModel.create(newMessage) ;

        message = await message.populate("sender","name profile");  //.execPopulate();
        message = await message.populate("chat");  //.execPopulate();
        message = await User.populate(message, {
            path:"Chat.users",
            select:"name profile email"
        })
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage : message
        })

        res.status(200).send({message :"message succesfull",message}) ;

    }catch(error){
        console.log(error);
        res.status(400).send({message :"error", error}) ;
    }

})

const getAllMesssageController = asyncHandler(async(req,res)=>{
 

    try{
        const messages = await messageModel.find({
            chat : req.params.chatId
        }).populate(
            "sender",
            "name pic email"
        ).populate('chat');
        res.status(200).send({message :"message list", messages}) ;
    }catch(eroor){
        console.log(eroor);
        res.status(400).send({message :"error", eroor}) ;
    }
    
})

module.exports = {sendMessageController,getAllMesssageController}