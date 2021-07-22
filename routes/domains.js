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

router.put('/addDoctoDomain',requireLogin,(req,res) => {
    const {domainId,docId} = req.body
    Domain.findByIdAndUpdate(domainId,{$push:{documents:docId}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }  
    })
})

router.put('/checkDocinDomain',requireLogin,(req,res)=>{
    const {docId,domainId} = req.body
    Domain.findById(domainId,(err,result)=>{
        if(result){
            console.log(result.documents,docId)
            if(result.documents.includes(docId)){
                console.log("Heyy it is ",true)
                return res.json(true)
            }
            else{
                console.log(false)
                return res.json(false)
            }
        }
        else if(err){
            return res.status(422).json({error:err})
        }
    })
})

module.exports = router