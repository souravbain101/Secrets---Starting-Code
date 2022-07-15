require('dotenv').config()
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
// const cncrypt=require("mongoose-encryption");
// const md5=require("md5");
// const bcrypt=require("bcrypt");
// const saltRounds=10;



const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
// USING SESSION
app.use(session({
    secret: 'Our Little Secret',
    resave: false,
    saveUninitialized: true,
  
  }));

  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userschema=new mongoose.Schema({
    email:String,
    password:String
})

userschema.plugin(passportLocalMongoose)
// userschema.plugin(cncrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userschema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})
app.get("/secrets",function(req,res){
   if (req.isAuthenticated()) {
    res.render("secrets");
   }
   else{
    res.redirect("/login");
   }
})
app.get("/logout",function(req,res,next){
    req.logOut(function(err){
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
    
});


app.post("/register",function(req,res){
    // const useremail=req.body.username;
    // const userpassword=req.body.password;
    // bcrypt.hash(userpassword, saltRounds, function(err, hash) {
    //     const newUser= new User({
    //         email:useremail,
    //         password:hash
    //     })
    //     newUser.save(function(err){
    //         if (!err) {
    //            res.render("secrets");
    //         }
    //         else{
    //             console.log(err);
    //         }
    //     })
    // });

    User.register({username:req.body.username},req.body.password,function(err,user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})


app.post("/login",function(req,res){
//     const useremail=req.body.username;
//     const userpassword=req.body.password;
// User.findOne({email:useremail},function(err,founduser){
//     if (err) {
//         console.log(err);
//     }
//     else{
//         bcrypt.compare(userpassword, founduser.password, function(err, result) {
//             if (result===true) {
//                 res.render("secrets");
//             }
//         });
//     }
// })
const user=new User({
    username:req.body.username,
    password:req.body.password

})
req.logIn(user,function(err){
    if (err) {
        res.redirect("/login");
    }
    else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
})

})

app.listen(3000,function(){
    console.log("Successfully started the server");
})
