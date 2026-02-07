// step 7--User authentication 
//step 9--adding bycrpt
//step 10--Jwt token
const User=require("../models/user");
const validate=require("../utils/validater");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const redisClient=require("../config/redis")
const Submission = require("../models/submission")
const register = async (req,res)=>{
    
    try{
        // validate the data;
      validate(req.body); 
      const {firstName, emailID, password}  = req.body; // Changed emailId to emailID

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailID:emailID, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60}); // Changed emailId to emailID
     const reply={
            firstName:user.firstName,
            emailID:user.emailID,
            _id:user._id
        }
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send.json({
            user:reply,
            message:"Loggin successfully"
        })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailID, password} = req.body; // Changed emailId to emailID

        if(!emailID) // Changed emailId to emailID
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailID}); // Changed emailId to emailID

        const match = await bcrypt.compare(password, user.password);
            console.log('Password match:', match); // Add this

        if(!match)
            throw new Error("Invalid Credentials");
        const reply={
            firstName:user.firstName,
            emailID:user.emailID,
            _id:user._id
        }

        const token =  jwt.sign({_id:user._id , emailID:emailID, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60}); // Changed emailId to emailID
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).json({
            user:reply,
            message:"Loggin successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailID, password}  = req.body; // Changed emailId to emailID

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailID:emailID, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60}); // Changed emailId to emailID
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.user._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {register, login,logout,adminRegister,deleteProfile};