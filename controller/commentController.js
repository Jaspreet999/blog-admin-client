const {body,validationResult} = require('express-validator')
const axios = require('axios')
var key = require('../key')

exports.sent_comment = [

    body('message').trim().isLength({min:1}).withMessage('please enter some text').escape(),

    async (req,res,next)=>{

        const error = validationResult(req)
        
        if(!error.isEmpty()){
            if(key.user !== ""){
                res.render('view',{user:key.user,errors:error.array()})
                return
            }else{
                res.redirect('/login')
                return
            }    
        }

        const comment = {
            message:req.body.message
        }

        const headers ={
            "authorization":(process.env['TOKEN']),
            "Content-Type": "application/json"
        }

        try{
            const response = await axios.post('http://localhost:3001/comment/'+req.params.id+"/createusercomment",{comment},{headers});
            if(response.status === 200){
                return res.redirect('/home/'+req.params.id+'/view')
            }
        }catch (e) {
            console.log(e)
            return res.redirect('/login')
        }

    }
]