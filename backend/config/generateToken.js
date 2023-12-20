const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const generateToken = (id) =>{
    return jwt.sign({id},process.env.SECRET_JWT_KEY,{
        expiresIn:"1d"
    })
}

const hashPassword= async(password) => {
    return await bcrypt.hash(password, 10);
}

const compareHashedPassword = async(hashedPassword, password) => {
    const a = await bcrypt.compare(password, hashedPassword);
    return a;
}
   
module.exports ={hashPassword,compareHashedPassword,generateToken}