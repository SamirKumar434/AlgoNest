const mongoose = require('mongoose');
const Problem = require('./src/models/problem'); // Adjust path to your model
require('dotenv').config();

const updateTwoSumTestCases = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("Connected to DB...");

        // 1. Find the Two Sum problem
        const problem = await Problem.findOne({ title: "Two Sum" });
        if (!problem) throw new Error("Two Sum problem not found");

        // 2. Helper to convert "[1,2]\n3" to '{"nums":[1,2],"target":3}'
        const convertToJSON = (rawInput) => {
            const parts = rawInput.split('\n');
            if (parts.length < 2) return rawInput; // Already fixed or wrong format
            return JSON.stringify({
                nums: JSON.parse(parts[0].trim()),
                target: parseInt(parts[1].trim())
            });
        };

        // 3. Update Hidden Test Cases
        problem.hiddenTestCases = problem.hiddenTestCases.map(tc => ({
            ...tc.toObject(),
            input: convertToJSON(tc.input)
        }));

        // 4. Update Visible Test Cases
        problem.visibleTestCases = problem.visibleTestCases.map(tc => ({
            ...tc.toObject(),
            input: convertToJSON(tc.input)
        }));

        await problem.save();
        console.log("✅ Two Sum test cases migrated to JSON format!");
        process.exit();
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

updateTwoSumTestCases();