const express = require('express');
const adminMiddleware=require('../middleware/adminMiddleware');
const userMiddleware=require('../middleware/userMiddleware')
const problemRouter =  express.Router();
const {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    solvedAllProblembyUser,
    submittedProblem
} = require('../controllers/userProblem'); 


// Create
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllproblem",userMiddleware ,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:id",userMiddleware,submittedProblem);
module.exports=problemRouter;

// fetch
// update
// delete 
