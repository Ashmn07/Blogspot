const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Domain = mongoose.model('Domain')
const requireLogin = require('../requireLogin')

router.get("/allDomains",requireLogin,(req, res)=>{
    Domain.find()
    .then(domains => res.json({domains}))
})

router.get("/userDomains",requireLogin,(req,res) =>{
    User.findById(req.user._id)
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
        res.json({domain:result})
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

module.exports = router