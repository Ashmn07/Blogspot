const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Document = mongoose.model('Document')
const Domain = mongoose.model('Domain')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const requireLogin = require('./requireLogin')

const JWT_SECRET = "UtdSignSancho"

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
                const token = jwt.sign({_id:saveduser},JWT_SECRET)
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

router.get("/allDomains",requireLogin,(req, res)=>{
    Domain.find()
    .then(domains =>{console.log(domains)})
})

router.get("/domains",requireLogin,(req,res) =>{
    const domains = req.user.domains
    return res.json({domains})
})

router.put("/domainDetails",requireLogin,(req,res)=>{
    const {domainId} = req.body
    Domain.find({domainId: domainId})
    .populate({path:'users',select:'_id name email'})
    .then(result =>{
        res.json({user:result[0].users})
    })
})

router.get("/documents",requireLogin,(req,res) =>{
    const documents = req.user.documents
    return res.json({documents})
})

router.put("/documentIds",requireLogin,(req,res) =>{
    const {docId} = req.body
    Document.findById(docId).then(res => {
        if(res){
            console.log(true)
            return true;
        }
        else{
            console.log(false)
            return false;
        }
    })
})

router.put("/api/join",requireLogin,(req, res) =>{
    const {domainId} = req.body
    User.findByIdAndUpdate(req.user._id,{$push:{domains:domainId}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Domain.findOneAndUpdate({domainId:domainId},{$push:{users:req.user._id}},{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            console.log(result)
        })
    })
})

router.put("/api/joinDoc",requireLogin,(req, res) =>{
    const {docId} = req.body
    User.findByIdAndUpdate(req.user._id,{$push:{documents:docId}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})            
        }
        Document.findByIdAndUpdate(docId,{$push:{users:req.user._id}},{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err})  
            }
            console.log(result)
        })
    })
})

module.exports = router