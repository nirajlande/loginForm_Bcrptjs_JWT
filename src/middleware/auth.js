const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
const Register = require("../models/userSchema");
require('dotenv').config()



const auth = async (req,res,next) =>{
    
    try{

        const token =  req.cookies.jwt;
        const verifyUser = await jwt.verify(token,process.env.SECRET_KEY);
        console.log(`verify user ${verifyUser}`);
        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user);
        next();
    }
    catch(error){
        res.render("login");

    }
}
module.exports = auth;