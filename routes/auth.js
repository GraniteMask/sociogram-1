const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const { equal } = require('assert')
const {SENDGRID_API, EMAIL} = require("../config/keys")

/*router.get('/', requireLogin, (req,res)=>{
    res.send("hello")
})*/

// router.get('/protected', requireLogin,(res,req)=>{
//     res.send("hello user")
// })

//below is the api key of SendGrid




const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: SENDGRID_API
    }
}))

router.post('/signup', (req,res)=>{
    const {name, email, password,pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"please add all the fields"})  //return here so that no proceed if status code is 422 ir false for if statement
    }
    //res.json({message:"successfully posted"})
    User.findOne({email: email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user exist with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply.sociogram@intrees.org",
                    subject:"SignUp Success..Wohoo!!!",
                    html:`<h1>Sociogram community welcomes you onboard :)</h1><br><h3>Start your Sociogram journey by clicking <a href='${EMAIL}'>here</a></h3><br><h5>This is auto-generated email. Please don't reply to this mail. For any feedback please contact the official Sociogram team through their app.Thank You</h5><br><img style='width:50%; height:50%' src='https://res.cloudinary.com/rd1/image/upload/v1598806691/finalLogo_sn3wc6.png'/>`
                })
                res.json({message:"Signup Success-Please check your email"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email: email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{  //doMatch & savedUser is a boolean value
            if(doMatch){
                //res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token, user: {_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/resetpassword', (req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User don't exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000  //in milliseconds...this number is millisec for 1 hr
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply.sociogram@intrees.org",
                    subject:"Password Reset Request",
                    html:`
                    <p>This has sent to you as you requested for password reset</p>
                    <h5>Click this <a href="${EMAIL}/resetpwd/${token}">link</a> to reset your password</h5>
                    <p>If you didn't request for it then please change your password immediately as it would be a potential hacking attempt.Thank You</p>
                    `
                })
                res.json({message:"Kindly Check your email"})
            })
        })
    })
})

router.post('/newpassword', (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}}) //$gt means greater than
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Sorry try again as session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"Password Successfully Updated"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router