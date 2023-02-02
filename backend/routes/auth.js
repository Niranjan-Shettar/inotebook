const express=require("express");
const router = express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Niruisagood$boy';
const fetchuser=require('../middlewear/fetchuser');

//Route1:Create user using:POST "api/auth/lcreateuser" no login is required
router.post('/createuser', [
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with same email already exist
    try{
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"Sorry user with this email is already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create a new user
        user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    })
    // .then(user => res.json(user)).catch(err=>{console.log(err)
    //      res.json({error:'please enter unique email',message:err.message})})
    const data={
        user:{
            id:user.id
        }

    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    res.json({authtoken})
    // res.json(user)
} catch(error){
    console.error(error.message);
    res.status(500).send("Internal server errors occured")
}
})
//Route2:Authenticate user using:POST "api/auth/login" no login is required
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password shouldnot blank').exists(),
    // body('password','password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const{email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user.id
            }
    
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json({authtoken})

    } catch (error){
        console.error(error.message);
        res.status(500).send("Internal server errors occured")

    }


})

//Route3:Get loggedin user details using:POST "api/auth/getuser" no login is required
router.post('/getuser',fetchuser, async (req, res) => {
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password")
    res.send(user)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server errors occured")
}
})
module.exports = router