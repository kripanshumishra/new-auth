const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userschema');



router.use(express.json())
router.use(express.urlencoded({extended:true}))


//          ----get request-----

router.get('/user', async (req,res)=>{
    console.log('request arrived')
    try{
        const user= await User.find({})
        res.send(user)
    }catch(e){
        console.log(e)
    }   
})


//          -------post request-------

router.post('/register', async (req,res)=>{
    try{
        const hash = await bcrypt.hash(req.body.password,10)
        const user = await User.create(
            {
                name:req.body.name,
                email:req.body.email,
                password:hash,
                mobile:req.body.mobile,
                role:req.body.role? req.body.role : 'user'
            }
        )
        console.log(user)
        res.status(200).json({register:true})

    }catch{
        res.status(500).json({msg:'try with another email id ......'})

    }
})
router.post('/login', async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    // console.log(user)
    if(!user){
        return res.status(400).json({msg : 'user did not find'});
    }
    try{
        const compare= await bcrypt.compare(req.body.password, user.password)
        // console.log(await bcrypt.compare(req.body.password, user.password))
        if (compare){
            let token = jwt.sign({id:user._id,email:user.email},process.env.secret_token,{expiresIn:86400}) //24hr
            return res.status(200).json({auth:true,token:token , , userInfo:{name:user.name,email:user.email,mobile:user.mobile} })
            // res.status(200).send('user credential right ')
        }
        
        else res.status(401).json({auth:false,token:'no token',msg:"invalid username or password" })
        
    }
    catch{
        res.send(500).json({msg:'something went wrong'})
    }
})

router.post('/userInfo',(req,res)=>{
    let token= req.headers['credential'];
    if(!token){
        res.json({auth:false, token:'no token'})
    }
    jwt.verify(token,process.env.JWT_SECRET , (err,user) => {
        if(err) res.status(200).json({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result)=>{
            res.json({result,access:"yes"})
        })
    })

})


module.exports = router
