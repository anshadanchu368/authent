//jshint esversion:6
require('dotenv').config();
const express=require('express');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app=express();
const bodyParser=require('body-parser');
const ejs=require('ejs');
app.set('view engine', 'ejs');





app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/userdb");

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});


const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
    res.render('home');
});
app.get("/login", (req, res) => {
    res.render('login');
});
app.get("/register", (req, res) => {
    res.render('register');
});
app.post("/register", (req, res) => {
    const  newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save((err) => {
        if(!err) {
         res.render("register");
        }else{
             console.log(err);
        }
    });
});

app.post("/login", (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}, (err, result) => {
       if(err) {
            console.log(err);
        }else{
            if(result){
                if(result.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000,function(){
    console.log('Listening on port 3000');
});