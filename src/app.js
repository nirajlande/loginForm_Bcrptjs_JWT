require('dotenv').config()
const express = require("express");
const app = express();
const path =require("path");
require("./db/conn.js")
const Register = require("./models/userSchema");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const async = require("hbs/lib/async");
//const bcrypt = require("bcryptjs/dist/bcrypt");
const bcrypt = require("bcryptjs");
const { stringify } = require("querystring");


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partial_path = path.join(__dirname,"../templates/partials");

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);
app.use(express.json());
app.use(express.urlencoded({extended:false})); 

console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/index",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/register",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        if(password==cpassword){
           
            const registerEmp = new Register({
                firstname:req.body.firstname,
                lastname : req.body.lastname,
                gender:req.body.gender,
                email : req.body.email,
                phoneNumber :req.body.phoneNumber,
                password:req.body.password,
                confirmPassword:req.body.confirmPassword
            })
            
            const token = await registerEmp.generateToken();
            
            const registered = await registerEmp.save();
            res.status(201).render("index");

        }else{
            res.send("password not matching");  
        }


    }catch(err){
        console.log(err);
         res.status(400).render(err);
        
    }
})

app.post("/login",async(req,res)=>{
    
    try{
    
       const emailId = req.body.email;
       const pass =  req.body.password; 
       
       const user = await Register.findOne({email:emailId});
       const token = await user.generateToken();
       console.log(token);
       if(bcrypt.compare(pass,user.password))
       {
           res.render("index");
       }
       else{
          res.send("password not correct");
       }
       
    }catch(err){
      console.log(err);
    }

})
app.listen(port,()=>{
    console.log("connect")
});