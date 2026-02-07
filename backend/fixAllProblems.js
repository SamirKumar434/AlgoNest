const mongoose = require('mongoose');
const Problem = require('./src/models/problem'); // Adjust path to your model
require('dotenv').config();

const fixAllProblems = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("🚀 Connected to MongoDB...");

        const problems = await Problem.find({});
        console.log(`Processing ${problems.length} problems...`);

        for (let problem of problems) {
            const title = problem.title;

            // 1. Helper to turn raw string "[1,2]\n9" into '{"nums":[1,2],"target":9}'
            const formatInput = (rawInput) => {
                try {
                    // If it's already a JSON object string, skip
                    if (rawInput.trim().startsWith('{')) return rawInput;

                    const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l !== "");
                    
                    // Case for problems with multiple inputs (like Two Sum)
                    if (lines.length >= 2) {
                        return JSON.stringify({
                            nums: JSON.parse(lines[0]),
                            target: isNaN(lines[1]) ? JSON.parse(lines[1]) : Number(lines[1])
                        });
                    } 
                    // Case for problems with single input (like Max Consecutive Ones)
                    else if (lines.length === 1) {
                        return JSON.stringify({ nums: JSON.parse(lines[0]) });
                    }
                    return rawInput;
                } catch (e) {
                    console.log(`⚠️  Could not auto-format input for ${title}: ${rawInput}`);
                    return rawInput;
                }
            };

            // 2. Update Test Cases
            problem.visibleTestCases = problem.visibleTestCases.map(tc => ({
                ...tc.toObject(),
                input: formatInput(tc.input)
            }));
            problem.hiddenTestCases = problem.hiddenTestCases.map(tc => ({
                ...tc.toObject(),
                input: formatInput(tc.input)
            }));

            // 3. Update Start Code (The Boilerplate)
            // This ensures users start with the correct (input) parameter
            const funcName = problem.functionName || "solution";
            problem.startCode = [
                {
                    language: "javascript",
                    initialCode: `function ${funcName}(input) {\n    const { nums } = input;\n    // Your code here\n};`
                }
            ];

            await problem.save();
            console.log(`✅ Migrated: ${title}`);
        }

        console.log("\n🎉 All problems are now JSON-compliant!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Critical Migration Error:", err);
        process.exit(1);
    }
};

fixAllProblems();