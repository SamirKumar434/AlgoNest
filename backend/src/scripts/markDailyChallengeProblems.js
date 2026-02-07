const mongoose = require('mongoose');
const Problem = require('../models/problem');
require('dotenv').config();

const markProblems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Mark first 10 problems as eligible
        const problems = await Problem.find().limit(10);
        
        for (const problem of problems) {
            problem.isDailyChallenge = true;
            await problem.save();
            console.log(`✅ Marked: ${problem.title} (${problem.difficulty})`);
        }
        
        console.log(`\n✅ Marked ${problems.length} problems as daily challenge eligible`);
        
        // Check counts by difficulty
        const easyCount = await Problem.countDocuments({ 
            isDailyChallenge: true, 
            difficulty: 'easy' 
        });
        const mediumCount = await Problem.countDocuments({ 
            isDailyChallenge: true, 
            difficulty: 'medium' 
        });
        const hardCount = await Problem.countDocuments({ 
            isDailyChallenge: true, 
            difficulty: 'hard' 
        });
        
        console.log('\n📊 Available challenges by difficulty:');
        console.log(`   Easy: ${easyCount}`);
        console.log(`   Medium: ${mediumCount}`);
        console.log(`   Hard: ${hardCount}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

markProblems();