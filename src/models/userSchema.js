const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const async = require("hbs/lib/async");
const res = require("express/lib/response");

const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    confirmPassword:{
        type:String,
        required:true,
         
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

employeeSchema.methods.generateToken = async function(){
    try{
        
        const token = await jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        return token;


    }catch(err){
          console.log(err);
    }
} 

employeeSchema.pre("save",async function(next){

    
    this.password =await bcrypt.hash(this.password,10);
    this.confirmPassword = undefined;
    next();
    

})


const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;