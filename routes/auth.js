const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const {EmailId} = require('../keys')
const {Password} = require('../keys')
// require('dotenv').config()


// router.get('/', (req, res)=>{
//     res.send("hello")
// })

// router.get('/protected', requireLogin, (req, res)=>{
//     res.send("helloworld")
// })

router.post('/signup' , (req,res)=>{
     const {name, email, password, pic} = req.body
     if(!email || !password ||!name){
      return   res.status(422).json({error:"please add all the fields"})
     }
     User.findOne({email:email})
     .then((savedUser)=>{
         if(savedUser){
             return res.status(422).json({error:"User already exista with that email"})
         }

        
         bcrypt.hash(password, 12)
         .then (hashedpassword=>{
            
            const user = new User({
                email,
                password : hashedpassword,
                name,
                pic
            })
               user.save()

        //     // var nodemailer = require('nodemailer');
        //      // const user = process.env.email ;
        //     // const pass = process.env.password ;
        //     // console.log('Email and password : ', user , pass)


            .then(user=>{
              res.json({message:"saved successfully"})
         
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

router.post('/signin' , (req, res)=>{
    // console.log(process.env.name+ "hii its coming")
    const{email, password} = req.body
    if(!email|| !password){
      return  res.status(422).json({error:"please add email or password"})

    }
    User.findOne({email:email})
    .then(savedUser=>{
        if (!savedUser){
          return  res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(Matched =>{
            if(Matched){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
               const {_id, name, email, followers, following, pic} = savedUser
               res.json({token:token, user:{_id, name, email, followers, following, pic}})
            }
            else{
                return  res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    
})

module.exports = router
