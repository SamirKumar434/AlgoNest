const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./src/models/problem'); 

const updateProblems = async () => {
    try {
        // Use the exact name from your .env file
        const uri = process.env.DB_CONNECT_STRING;
        
        if (!uri) {
            throw new Error("DB_CONNECT_STRING is undefined. Check your .env file!");
        }

        await mongoose.connect(uri);
        console.log("🚀 Connected to MongoDB...");

        const problems = await Problem.find({});
        console.log(`Checking ${problems.length} problems...`);
        
        const updates = problems.map(async (prob) => {
            let funcName = "";
            const title = prob.title ? prob.title.trim() : "";
            
            switch (title) {
                case "Two Sum": funcName = "twoSum"; break;
                case "Second Largest No.": funcName = "findSecondLargest"; break;
                case "Check if Array is Sorted and Rotated": funcName = "checkSortedRotated"; break;
                case "Remove Duplicates from Sorted Array": funcName = "removeDuplicates"; break;
                case "Max Consecutive Ones": funcName = "findMaxConsecutiveOnes"; break;
                case "Sort 0s, 1s, and 2s": funcName = "sortColors"; break;
                case "Maximum Subarray Sum": funcName = "maxSubArray"; break;
                case "Stock Buy and Sell": funcName = "maxProfit"; break;
                case "Next Permutation": funcName = "nextPermutation"; break;
                case "Leaders in an Array": funcName = "leaders"; break;
                case "Repeating and Missing Numbers": funcName = "findRepeatingAndMissing"; break;
                case "Count Inversions": funcName = "countInversions"; break;
                case "Reverse Pairs": funcName = "reversePairs"; break;
                case "Maximum Product Subarray": funcName = "maxProduct"; break;
                case "Majority Element II": funcName = "majorityElement"; break;
                default:
                    // Fallback to camelCase for any other titles
                    funcName = title.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            }

            console.log(`✅ Mapping: "${title}" -> ${funcName}`);
            return Problem.findByIdAndUpdate(prob._id, { $set: { functionName: funcName } });
        });

        await Promise.all(updates);
        console.log(`\n🎉 Success! All problems updated.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
        process.exit(1);
    }
};

updateProblems();