const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Chat = require('../models/chatModel'); 
const { parse } = require('dotenv');

// create chat controller
const accessChatController = asyncHandler(async(req, res) => {

    const {userId} = req.body;
    if (!userId) {
        console.log("userid does params not sent");
        return res.send(400);
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: {
                    $elemMatch: {
                        $eq: req.user._id
                    }
                }
            }, {
                    users: {
                        $elemMatch: {
                            $eq: req.userId
                        }
                    }
                }
            ]

    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat
                .findOne({_id: createdChat._id})
                .populate("users", "-password");

            res
                .status(200)
                .send(fullChat);

        } catch (error) {
            console.log(`error in chat`);
            console.log(error);

        }
    }

});

//fetch chat data 
const fetchChatController = asyncHandler(async(req, res) => {
    try{
        Chat.find({users: { $elemMatch: {$eq : req.user.id}}}).
        populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({updatedAt :-1}).then(async(resu)=>{
            resu =await Chat.populate(resu, {
                path: "latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(resu)

        });

        
    }catch(error){
        console.log('errror in fetching chats');
    }
});

//  createGroupChatController
const createGroupChatController = asyncHandler(async(req, res) => {

    const { name} = req.body;

    if(!name || !req.body.users){
        return res.status(400).send({message:"please fill all the fields"});
    }
    let users =JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send({message:"nnedd , more than two users to form a group"});
    }

    users.push(req.user)

    try{
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin : req.user,
        });

        const fullGroupChat = await Chat.findOne({_id : groupChat._id}).populate('users','-password').populate("groupAdmin","-password")

        res.status(200).send(fullGroupChat);

    }catch(error){
        console.log(`error in chat`);
        console.log(error);
    }
});

//  renameGroupChatController
const renameGroupChatController = asyncHandler(async(req, res) => {

    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new : true
        }
    ).populate('users','-password').populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(400).send({message: "error in updating chat name",updatedChat})
    }else{
        res.status(201).send({updatedChat})
    }
});

// addToGroupGroupChatController
const addToGroupGroupChatController = asyncHandler(async(req, res) => {

    const  {chatId, userId} = req.body;
    const addUser =await Chat.findByIdAndUpdate(chatId, 
        {
            $push:{users : userId}
        },
        {
            new : true
        }
    ).populate('users','-password').populate("groupAdmin","-password");

    if(!addUser){
        res.status(400).send({message: "chat not found and error in adding to group"})
    }else{
        res.status(201).send({message:"added succesfully",addUser})
    }
})

// removeFromGroupGroupChatController
const removeFromGroupGroupChatController = asyncHandler(async(req, res) => {

    const  {chatId, userId} = req.body;
    const removeFromGroup =await Chat.findByIdAndUpdate(chatId, 
        {
            $pull:{users : userId}
        },
        {
            new : true
        }
    ).populate('users','-password').populate("groupAdmin","-password");

    if(!removeFromGroup){
        res.status(400).send({message: "chat not found and error in adding to group"})
    }else{
        res.status(201).send({message:"removed succesfully",removeFromGroup})
    }
});
module.exports = {
    fetchChatController,
    renameGroupChatController,
    accessChatController,
    removeFromGroupGroupChatController,
    addToGroupGroupChatController,
    createGroupChatController
}