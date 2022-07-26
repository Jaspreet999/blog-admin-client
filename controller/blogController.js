require('dotenv').config({path: __dirname + '/.env'})
const {body,validationResult} = require('express-validator')
const axios = require('axios')
var key = require('../key')
const moment = require('moment')

exports.create_blog = async function(req,res){
    
    res.render('createblog',{blog:undefined,user:key.user})
}

exports.post_create_blog = [

    body('title','title must be required').trim().isLength({min:1}).escape(),
    body('description').trim().isLength({min:1}).withMessage('text must be required').escape(),
    body('visibility').escape(),

    async (req,res,next)=>{
        
        const error = validationResult(req)
        
        if(!error.isEmpty()){
            if(key.user !== ""){
                res.render('createblog' ,{errors:error.array()})
                return;
            }else{
                res.redirect('/login')
                return
            }    
        }else{
            
            

            var description = req.body.description
            description = description.replace("&lt;p&gt;","")
            req.body.description = description.replace("&lt;&#x2F;p&gt;","")
            
            blog = {
                title:req.body.title,
                description:req.body.description,
                visibility:req.body.visibility
            }

            const headers ={
                "authorization":(process.env['TOKEN']),
                "Content-Type": "application/json"
            }   
            //send request to backend
            try{
                const response = await axios.post('http://localhost:3001/blogs/createblog',{blog},{headers});

                if(response.status === 200){
                    
                    res.redirect('/home')
                }
            }catch (e) {
                res.redirect('/login')
            }
        }
        
    } 
]

exports.get_home = async function(req,res){
    const token = process.env['TOKEN']
    //send request to backend
    try{
        const response = await axios.get('http://localhost:3001/blogs/user',{headers:{
            Authorization:token,
        }});
        
        if(response.status === 200){
            res.locals.require = require;
            return res.render('home',{blogs:response.data.blogs,user:key.user})
        }
    }catch (e) {
        return res.redirect('/login')
    }
}

exports.get_view = async function(req,res){
    const headers ={
        "authorization":(process.env['TOKEN']),
        "Content-Type": "application/json"
    }
    //send request to backend
    try{
        const response = await axios.get('http://localhost:3001/blogs/'+req.params.id+"/getdetail",{headers});
        console.log(response)
        if(response.status === 200){
            res.locals.require = require;
            return res.render('view',{blog:response.data.blog,comments:response.data.comment,user:key.user})
        }
    }catch (e) {
        console.log(e)
        return res.redirect('/login')
    }
    
}

exports.get_update = async function(req,res){
    
    const headers ={
        "authorization":(process.env['TOKEN']),
        "Content-Type": "application/json"
    }
    //send request to backend
    try{
        const response = await axios.get('http://localhost:3001/blogs/'+req.params.id+"/getdetail",{headers});
        
        if(response.status === 200){
            return res.render('createblog',{blog:response.data.blog,user:key.user})
        }
    }catch (e) {
        return res.redirect('/login')
    }

}

exports.put_update = [

    body('title','title must be required').trim().isLength({min:1}).escape(),
    body('description').trim().isLength({min:1}).withMessage('text must be required').escape(),
    body('visibility').escape(),

    async (req,res,next)=>{
        
        const error = validationResult(req)
        if(!error.isEmpty()){
            if(key.user !== ""){
                res.render('createblog' ,{errors:error.array()})
                return;
            }else{
                res.redirect('/login')
                return
            }   
        }else{

            blog = {
                title:req.body.title,
                description:req.body.description,
                visibility:req.body.visibility
            }
            
            const headers ={
                "authorization":process.env['TOKEN'],
                "Content-Type": "application/json"
            }   
            
            console.log(headers)
            //send request to backend
            try{
                const response = await axios.put('http://localhost:3001/blogs/'+req.params.id+'/update',{blog},{headers});

                if(response.status === 200){
                    console.log(response.data)
                    res.redirect('/home')
                }
            }catch (e) {
                res.redirect('/login')
            }
        }
        
    } 
]

exports.put_delete =async function(req,res){
    const headers ={
        "authorization":process.env['TOKEN'],
        "Content-Type": "application/json"
    }
    //send request to backend
    try{
        const response = await axios.get('http://localhost:3001/blogs/'+req.params.id+"/delete",{headers});
        
        if(response.status === 200){
            return res.redirect('/home')
        }
    }catch (e) {
        //console.log(e)
        return res.redirect('/login')
    }
}

exports.update_visibility =async function(req,res){

    const headers ={
        "authorization":process.env['TOKEN'],
        "Content-Type": "application/json"
    }
    //send request to backend
    
    try{
        const response = await axios.get('http://localhost:3001/blogs/'+req.params.id+"/updatevisibility",{headers});
        
        if(response.status === 200){
            return res.redirect('/home')
        }
    }catch (e) {
        //console.log(e)
        return res.redirect('/login')
    }
}