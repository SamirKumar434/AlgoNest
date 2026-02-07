const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem=require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")
const createProblem = async (req,res)=>{
    console.log('Request body received:', req.body);

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;
    

    try{
        console.log('1. Starting referenceSolution loop...');
        /*
        console.log('referenceSolution:', referenceSolution);
        
        for(const {language,completeCode} of referenceSolution){
            console.log('2. Processing language:', language);
            
            const languageId = getLanguageById(language);
            console.log('3. Language ID for', language, ':', languageId);
            
            if (!languageId) {
                return res.status(400).send(`Invalid language: ${language}`);
            }

            console.log('4. visibleTestCases:', visibleTestCases);
            console.log('5. Type of visibleTestCases:', typeof visibleTestCases);
          
            console.log('6. About to map visibleTestCases...');
            const submissions = visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));
            console.log('7. Submissions created successfully');

            console.log('8. Calling submitBatch...');
            const submitResult = await submitBatch(submissions);
            console.log('9. submitBatch result:', submitResult);
            // Add this check:
if (!submitResult || !Array.isArray(submitResult)) {
    return res.status(400).send("submitBatch returned invalid result");
}

            const resultToken=submitResult.map((value)=>value.token);
            const testResult=await submitToken(resultToken);
            
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("error Ocuured");
                }
            }
        }
        */
        await Problem.create({
            ...req.body,
            problemCreator:req.user._id
        });
        res.status(201).send("problem saved successfully");
    }
    catch(err){
        console.log('ERROR CAUGHT:', err);
        console.log('Error stack:', err.stack);
        res.status(400).send("Error: "+err);
    }
}
const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
  const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;

  try{

     if(!id){
      return res.status(400).send("Missing ID Field");
     }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language,completeCode} of referenceSolution){
         

      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);
        
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value)=> value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      
     const testResult = await submitToken(resultToken);

    //  console.log(testResult);

     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}
const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}
const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");
      

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');

   if(!getProblem)
    return res.status(404).send("Problem is Missing");
   //their is difference between find and findOne. fineOne returns u a array
   const videos = await SolutionVideo.findOne({problemId:id});

   
   if(videos){   
    
   const responseData = {
    ...getProblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
   } 
  
   return res.status(200).send(responseData);
   }


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}
const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}
const solvedAllProblembyUser =  async(req,res)=>{
   
    try{
       
      const userId = req.user._id;

      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
      
      res.status(200).send(user.problemSolved);

    }
    catch(err){
      res.status(500).send("Server Error");
    }
}
const submittedProblem = async(req,res)=>{
  try{
    const userId = req.user._id;  // Make sure this is req.user
    const problemId = req.params.id;  // Note: params.pid, not params.id

    const ans = await Submission.find({userId,problemId});
    
    if(ans.length==0)
      res.status(200).send("No Submission is present");  // PROBLEM: Returns string

    res.status(200).send(ans);  // Should return array
  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}
module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};











// const submissions = [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       stdin:23,
//       expected_output:43,
//     },
//     {
//       "language_id": 123456789,
//       "source_code": "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": ""
//     }
//   ]
