const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// ✅ Move the wrapper function OUTSIDE of submitCode function
const wrapJavaScriptCode = (code, exampleInput) => {
  // Extract function name
  const funcMatch = code.match(/function\s+(\w+)\s*\(/);
  const functionName = funcMatch ? funcMatch[1] : 'solution';
  
  return `
${code}

// Universal wrapper (works for all problems)
const input = require('fs').readFileSync(0, 'utf-8').trim();
try {
  // Try to parse as JSON, fallback to string
  let parsedInput = input;
  try {
    parsedInput = JSON.parse(input);
  } catch(e) {
    // Keep as string
  }
  
  const result = ${functionName}(parsedInput);
  
  // Smart output
  if (Array.isArray(result)) {
    console.log(JSON.stringify(result));
  } else if (result && typeof result === 'object') {
    console.log(JSON.stringify(result));
  } else if (result !== undefined) {
    console.log(result.toString());
  } else {
    console.log('');
  }
} catch(error) {
  console.error(error.message);
}
`;
};

const submitCode = async (req, res) => {
  try {
    // ✅ FIRST: Extract from req.body
    const { code, language } = req.body;
    const userId = req.user._id;
    const problemId = req.params.id;

    // ✅ THEN: Validate
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ error: "Some field missing" });
    }

    // Normalize language
    let normalizedLanguage = language;
    if (language === 'cpp') {
      normalizedLanguage = 'c++';
    }

    console.log("Language:", normalizedLanguage);

    // Fetch the problem from database
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // ✅ Prepare code with wrapper
    let finalCode = code;
    if (normalizedLanguage === 'javascript' || normalizedLanguage === 'js') {
      const exampleInput = problem.hiddenTestCases[0]?.input;
      finalCode = wrapJavaScriptCode(code, exampleInput);
      console.log("Applied JavaScript wrapper");
    }

    // Create submission record
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language: normalizedLanguage,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });

    // Judge0 submission
    const languageId = getLanguageById(normalizedLanguage);
    
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: finalCode, // ✅ Use wrapped code
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Process results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for (const test of testResult) {
      console.log(`Test status: ${test.status_id}, stdout: ${test.stdout}`);
      
      if (test.status_id === 3) { // Accepted
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (test.status_id === 4) {
          status = 'wrong'; // Wrong answer
          errorMessage = test.stderr || `Expected: ${test.expected_output}, Got: ${test.stdout}`;
        } else if (test.status_id === 5) {
          status = 'timeout';
          errorMessage = 'Time limit exceeded';
        } else if (test.status_id === 6) {
          status = 'compile_error';
          errorMessage = test.compile_output;
        } else {
          status = 'error';
          errorMessage = test.stderr || test.message;
        }
      }
    }

    // Update submission
    submission.status = status;
    submission.testCasesPassed = testCasesPassed;
    submission.errorMessage = errorMessage;
    submission.runtime = runtime;
    submission.memory = memory;
    await submission.save();

    // ✅ FIXED: Update user's solved problems WITHOUT full validation
    if (status === 'accepted') {
      try {
        // Use findByIdAndUpdate to avoid full document validation
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { problemSolved: problemId } }, // $addToSet prevents duplicates
          { runValidators: false }  // Don't validate entire document
        );
        console.log("✅ Updated user's solved problems");
      } catch (updateError) {
        console.error("Note: Could not update user's solved problems", updateError.message);
        // Don't fail the submission if user update fails
      }
    }

    const accepted = (status === 'accepted');
    res.status(201).json({
      accepted,
      status,
      totalTestCases: submission.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      message: accepted ? "All test cases passed!" : errorMessage
    });

  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: err.message 
    });
  }
};

const runCode = async (req, res) => {
  try {
    // ✅ FIRST: Extract from req.body
    const { code, language } = req.body;
    const userId = req.user._id;
    const problemId = req.params.id;

    // ✅ THEN: Validate
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ error: "Some field missing" });
    }

    // Fetch the problem from database
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Normalize language
    let normalizedLanguage = language;
    if (language === 'cpp') {
      normalizedLanguage = 'c++';
    }

    // ✅ Prepare code with wrapper
    let finalCode = code;
    if (normalizedLanguage === 'javascript' || normalizedLanguage === 'js') {
      const exampleInput = problem.visibleTestCases[0]?.input;
      finalCode = wrapJavaScriptCode(code, exampleInput);
    }

    // Judge0 submission
    const languageId = getLanguageById(normalizedLanguage);

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: finalCode, // ✅ Use wrapped code
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let success = true;
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        success = false;
        if (test.status_id === 4) {
          errorMessage = `Wrong answer. Expected: ${test.expected_output}, Got: ${test.stdout}`;
        } else if (test.status_id === 5) {
          errorMessage = 'Time limit exceeded';
        } else if (test.status_id === 6) {
          errorMessage = `Compilation error: ${test.compile_output}`;
        } else {
          errorMessage = test.stderr || test.message;
        }
      }
    }

    res.status(201).json({
      success,
      testCases: testResult,
      runtime,
      memory,
      testCasesPassed,
      totalTestCases: problem.visibleTestCases.length,
      errorMessage
    });

  } catch (err) {
    console.error("Run error:", err);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: err.message 
    });
  }
};

module.exports = { submitCode, runCode };