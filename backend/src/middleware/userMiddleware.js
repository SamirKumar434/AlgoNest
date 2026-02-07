const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        // Ensure cookie-parser is used in index.js for this to work
        const { token } = req.cookies || {}; 
        
        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Redis Blocklist check
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        // CRITICAL: Must match the property name used in your routes
        req.user = user; 
        
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({ error: "Unauthorized: " + err.message });
    }
};

module.exports = userMiddleware;