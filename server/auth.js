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
    .then(domains => res.json({domains}))
})

router.get("/userDomains",requireLogin,(req,res) =>{
    User.findById(req.user._id)
    // .populate('domains')
    .then(result => console.log(result))
    const domains = req.user.domains
    return res.json({domains})
})

router.get("/userDomainsDetails",requireLogin,(req,res) =>{
    User.findById(req.user._id)
    .populate({path:'domains',select:'domainName _id description domainPic'})
    .then(result => {
        res.json(result.domains)
    })
})

router.put("/domainDetails",requireLogin,(req,res)=>{
    const {domainId} = req.body
    Domain.findById(domainId)
    .populate({path:'users',select:'_id name email'})
    .then(result =>{
        console.log(result)
        res.json({users:result.users})
    })
})

router.get("/documents",requireLogin,(req,res) =>{
    // const documents = req.user.documents
    // return res.json({documents})
    Document.find({users:req.user._id})
    .then(documents => res.json({documents}))
})

router.put("/documentIds",requireLogin,(req,res) =>{
    const {docId} = req.body
    Document.findById(docId).then(resp => {
        if(resp){
            console.log(true)
            return res.json(true);
        }
        else{
            console.log(false)
            return res.json(false);
        }
    })
})

router.put("/api/join",requireLogin,(req, res) =>{
    const {domainId} = req.body
    console.log(req.body)
    User.findByIdAndUpdate(req.user._id,{$push:{domains:domainId}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Domain.findByIdAndUpdate(domainId,{$push:{users:req.user._id}},{new:true},(err,result)=>{
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