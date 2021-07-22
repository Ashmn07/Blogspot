const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post("/signup",(req,res) => {
    const {name,email,password} = req.body
    if(!email || !name || !password){
        res.statusCode = 422
        return res.json({errMess:"All fields have not been filled"})
    }
    bcrypt.hash(password,12)
    .then((hashedpass) => {
        User.findOne({email: email})
        .then((saveduser)=>{
            if(saveduser){
                res.statusCode = 422
                return res.json({errMess: "User already exists"})
            }
            const user = new User({
                email: email, password: hashedpass, name: name
            })
            user.save()
            .then((sample)=> res.json("User Created Successfully"))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.statusCode = 422
        return res.json({errMess:"All fields have not been filled"})
    }
    User.findOne({email: email})
    .then((saveduser)=>{
        if(!saveduser){
            res.statusCode = 422
            return res.json({errMess: "User does not exist"})
        }
        bcrypt.compare(password,saveduser.password)
        .then((match)=>{
            if(match){
                const token = jwt.sign({_id:saveduser},process.env.JWT_SECRET)
                const {_id,name,email} = saveduser
                res.json({token,user:{_id,name,email}})
            }
            else{
                res.statusCode = 422
                return res.json({errMess: "Incorrect Password"})
            }
        })
        .catch(err =>console.log(err))
    })
    .catch(err =>console.log(err))
})

module.exports = router