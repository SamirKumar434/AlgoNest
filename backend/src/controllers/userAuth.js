// step 7--User authentication 
//step 9--adding bycrpt
//step 10--Jwt token
const User = require("../models/user");
const validate = require("../utils/validater");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Submission = require("../models/submission");

const register = async (req, res) => {
    try {
        // Validate the data
        validate(req.body);
        const { firstName, emailID, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailID: emailID, role: 'user' },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        const reply = {
            firstName: user.firstName,
            emailID: user.emailID,
            _id: user._id
        };

        // FIXED: Proper cookie configuration for cross-origin
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        // FIXED: Changed .send.json() to .json()
        res.status(201).json({
            user: reply,
            message: "Login successfully",
            tokenSet: true
        });

    } catch (err) {
        console.error("Register error:", err);
        res.status(400).json({ error: "Registration failed: " + err.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailID, password } = req.body;

        if (!emailID || !password) {
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ emailID });
        
        // FIXED: Check if user exists before comparing password
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match);

        if (!match) {
            throw new Error("Invalid credentials");
        }

        const reply = {
            firstName: user.firstName,
            emailID: user.emailID,
            _id: user._id,
            role: user.role
        };

        const token = jwt.sign(
            { _id: user._id, emailID: emailID, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // FIXED: Proper cookie configuration for cross-origin
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        res.status(200).json({
            user: reply,
            message: "Login successfully",
            tokenSet: true
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(401).json({ error: "Login failed: " + err.message });
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        
        // Clear the cookie FIRST to ensure it's always cleared
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        // If token exists, try to blacklist it
        if (token) {
            try {
                // Use jwt.decode instead of jwt.verify to handle expired tokens gracefully
                const payload = jwt.decode(token);
                
                if (payload && payload.exp) {
                    // Blacklist the token in Redis
                    await redisClient.set(`token:${token}`, 'Blocked');
                    await redisClient.expireAt(`token:${token}`, payload.exp);
                }
            } catch (jwtError) {
                // Token is invalid or expired - just log and continue
                console.log('Token invalid during logout (non-critical):', jwtError.message);
                // Don't throw error - we still want to clear the cookie
            }
        }

        res.status(200).json({ 
            success: true,
            message: "Logged out successfully" 
        });

    } catch (err) {
        console.error("Logout error:", err);
        
        // Even on error, try to clear the cookie
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
        
        res.status(200).json({ 
            success: true,
            message: "Logged out successfully (cookie cleared)" 
        });
    }
};

const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailID, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailID: emailID, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // FIXED: Same cookie configuration
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        res.status(201).json({ message: "User Registered Successfully" });

    } catch (err) {
        console.error("Admin register error:", err);
        res.status(400).json({ error: "Registration failed: " + err.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);
        // await Submission.deleteMany({ userId });

        res.status(200).json({ message: "Deleted Successfully" });

    } catch (err) {
        console.error("Delete profile error:", err);
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile };