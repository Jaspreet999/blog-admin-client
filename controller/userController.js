require('dotenv').config({path: __dirname + '/.env'})
const {body,validationResult} = require('express-validator')
const axios = require('axios')
const key = require('../key')


exports.login_user = function(req,res,next){
    res.render("login",{user:req.user})
}

exports.post_login_user =[
    body('username','username must be required').trim().isLength({min:1}).escape(),
    body('password').trim().isLength({min:4,max:16}).withMessage('password should be min 4 digits'),

    async (req,res,next)=>{

        const error = validationResult(req)

        if(!error.isEmpty()){
            res.render('signup' ,{errors:error.array()})
            return;
        }else{
            
            //send request to backend
            try{
                const response = await axios.post('http://localhost:3001/user/login',{username:req.body.username,
                password:req.body.password,});
                if(response.status === 200 && response.data.status == true){
                    process.env['TOKEN'] = response.data.token
                    key.user = response.data.user
                    res.redirect('/home')
                }
            }catch (e) {
                res.render('login',{error:"password or user not found"});
            }
        }  
    } 
]


exports.signup_user = function(req,res,next){
    res.render("signup")
}

exports.post_signup_user = [

    body('username','username must be required').trim().isLength({min:1}).escape(),
    body('password').trim().isLength({min:4,max:16}).withMessage('password should be min 4 digits'),
    body('confirmPassword').trim().isLength({min:4,max:16}).withMessage('password should be min 4 digits'),
    
    
    async (req,res,next)=>{
  
        var errmessage = "";
        const error = validationResult(req)

        if(req.body.password !== req.body.confirmPassword){
            errmessage = "password not match"
        }
        
        if(!error.isEmpty()){
            res.render('signup' ,{errors:error.array(),errMess:errmessage})
            return;
        }else{
            const headers = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            //send request to backend
            try{
                const response = await axios.post('http://localhost:3001/user/signup',{username:req.body.username,
                password:req.body.password},headers);
                if(response.status === 200){
                    process.env['TOKEN']= response.data.token
                    key.user = response.data.user
                    res.redirect('/home')
                }
                if(response.status === 409){
                    res.render('signup',{error:response.data.error})
                }
            }catch (e) {
                res.render('signup',{error:"this username already is in use"});
            }

        }
        
    } 
]

