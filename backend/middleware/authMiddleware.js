const User = require('../models/userModel');
const Jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  try {
    const decode = Jwt.verify(req.headers.authorization, process.env.SECRET_JWT_KEY);
    // console.log(`decode,de`, decode);
    req.user = await User.findById(decode.id).select("-password");
    // console.log(req.user);
    next();

} catch (error) {
    return res
        .status(401)
        .send({success: false, message: "Error in token", error})
}
}
)
module.exports = protect ;
