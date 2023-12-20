const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {hashPassword,generateToken,compareHashedPassword} = require('../config/generateToken')

const registerController = asyncHandler(async(req, res) => {
    const {name, email, password, profile} = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("please enter details");
    }
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400);
        throw new Error("user already exist");
    }const hashedPassword = await hashPassword(password);
    const user = await User.create({name, email, password:hashedPassword, profile});
    if (user) {
        res
        .status(200)
        .json({
            id: user._id,
            name:user.name,
            profile:user.profile,
            email:user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }

});

const loginController = asyncHandler(async(req, res) => {
    const { email, password} = req.body;
    console.log(email,password);

    if ( !email || !password) {
        res.status(400);
        throw new Error("please enter details");
    }
    const userExists = await User.findOne({email});
    if (userExists) {
        const match =await compareHashedPassword(userExists.password,password);console.log(match);
        if(match === true){
        res
            .status(200)
            .json({
                id: userExists._id,
                name:userExists.name,
                profile:userExists.profile,
                email:userExists.email,
                token: generateToken(userExists._id)
            });
        }else{
         res.status(400);
        throw new Error("invalid credenails");
        }
    } else {
        res.status(400);
        throw new Error("user does not exist");
    }

});


// get user search
const getAllUsersController = asyncHandler(async(req, res) => { 
    const keyword = req.query.search ? {
        $or:[
            {name:{$regex: req.query.search, $options :"i"}},
            {email:{$regex: req.query.search, $options :"i"}}
        ]
    }:
    {

    } ; 

    const users = await User.find(keyword) ;// . //find({ _id : {$ne : req.user._id}})
    res.send(users);
 

    // if ( !email || !password) {
    //     res.status(400);
    //     throw new Error("please enter details");
    // }
    // const userExists = await User.findOne({email});
    // if (userExists) {
    //     const match =await compareHashedPassword(userExists.password,password);console.log(match);
    //     if(match === true){
    //     res
    //         .status(200)
    //         .json({
    //             id: userExists._id,
    //             email:userExists.email,
    //             token: generateToken(userExists._id)
    //         });
    //     }else{
    //      res.status(400);
    //     throw new Error("invalid credenails");
    //     }
    // } else {
    //     res.status(400);
    //     throw new Error("user does not exist");
    // }

});

module.exports = {
    registerController,loginController,getAllUsersController
}