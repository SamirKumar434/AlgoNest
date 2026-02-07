
const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const submitCodeRateLimiter = require("../middleware/ratelimiter");
const { submitCode,runCode} = require("../controllers/userSubmission"); // Add { }

submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/run/:id", userMiddleware,submitCodeRateLimiter ,submitCode);
//submitRouter.get('/history/:id', userMiddleware, getSubmissionHistory);
module.exports=submitRouter;