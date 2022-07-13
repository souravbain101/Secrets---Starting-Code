require('dotenv').config()
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const cncrypt=require("mongoose-encryption");



const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userschema=new mongoose.Schema({
    email:String,
    password:String
})


userschema.plugin(cncrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userschema);





app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})


app.post("/register",function(req,res){
    const useremail=req.body.username;
    const userpassword=req.body.password;

    const newUser= new User({
        email:useremail,
        password:userpassword
    })
    newUser.save(function(err){
        if (!err) {
           res.render("secrets");
        }
        else{
            console.log(err);
        }
    })
})

app.post("/login",function(req,res){
    const useremail=req.body.username;
    const userpassword=req.body.password;
User.findOne({email:useremail},function(err,founduser){
    if (err) {
        console.log(err);
    }
    else{
        if (founduser.password===userpassword) {
            res.render("secrets");
        }
    }
})
})

app.listen(3000,function(){
    console.log("Successfully started the server");
})
