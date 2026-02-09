//Step 6-- Creating routing in  backend 
const express=require('express');
const authRouter=express.Router();
const {register,login,logout, adminRegister,deleteProfile}=require('../controllers/userAuth');
const userMiddleware=require("../middleware/userMiddleware")
const adminMiddleware=require("../middleware/adminMiddleware");
const { default: isEmail } = require('validator/lib/isEmail');
///Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Admin Routes
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// User Profile Routes
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

authRouter.get('/check', userMiddleware, (req, res) => {
    // FIX: Changed req.result to req.user to match your middleware
    const user = req.user; 
    
    if (!user) {
        return res.status(401).json({ message: "User not found in request" });
    }

    const reply = {
        firstName: user.firstName,
        emailID: user.emailID, 
        _id: user._id,
        role: user.role
    };

    res.status(200).json({
        user: reply,
        message: "valid user",
    });
});

authRouter.get("/profile", userMiddleware, async (req, res) => {
    // Verified: req.user is correctly used here
    const user = req.user; 
    if (!user) return res.status(404).send("User not found");
    
    res.send(`Welcome, ${user.firstName}`); 
});

module.exports = authRouter;