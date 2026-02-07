const User = require("../models/user");
const Problem = require("../models/problem");
const Submission = require("../models/submission");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user with populated problems
    const user = await User.findById(userId)
      .populate({
        path: 'problemSolved',
        select: '_id title difficulty tags'
      })
      .select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate statistics
    const totalProblems = await Problem.countDocuments();
    const solvedProblems = user.problemSolved.length;
    
    // Count by difficulty
    const easySolved = user.problemSolved.filter(p => p.difficulty === 'easy').length;
    const mediumSolved = user.problemSolved.filter(p => p.difficulty === 'medium').length;
    const hardSolved = user.problemSolved.filter(p => p.difficulty === 'hard').length;
    
    // Get total counts by difficulty
    const easyTotal = await Problem.countDocuments({ difficulty: 'easy' });
    const mediumTotal = await Problem.countDocuments({ difficulty: 'medium' });
    const hardTotal = await Problem.countDocuments({ difficulty: 'hard' });
    
    // Get recent submissions
    const recentSubmissions = await Submission.find({ userId })
      .populate({
        path: 'problemId',
        select: 'title difficulty'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('status runtime memory createdAt problemId');
    
    // Calculate accuracy
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ 
      userId, 
      status: 'accepted' 
    });
    const accuracy = totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
      : 0;
    
    // Get streak (consecutive days with submissions)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todaySubmissions = await Submission.countDocuments({
      userId,
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    });
    
    const yesterdaySubmissions = await Submission.countDocuments({
      userId,
      createdAt: {
        $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
        $lt: new Date(yesterday.setHours(23, 59, 59, 999))
      }
    });
    
    const streak = todaySubmissions > 0 ? 1 : (yesterdaySubmissions > 0 ? 1 : 0);
    // Note: For full streak calculation, you'd need more complex logic
    
    // Prepare response
    const profile = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailID: user.emailID,
        role: user.role,
        joined: user.createdAt
      },
      stats: {
        totalProblems,
        solvedProblems,
        solvedPercentage: Math.round((solvedProblems / totalProblems) * 100),
        accuracy,
        streak,
        totalSubmissions,
        acceptedSubmissions
      },
      difficultyStats: {
        easy: {
          solved: easySolved,
          total: easyTotal,
          percentage: easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0
        },
        medium: {
          solved: mediumSolved,
          total: mediumTotal,
          percentage: mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0
        },
        hard: {
          solved: hardSolved,
          total: hardTotal,
          percentage: hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0
        }
      },
      solvedProblems: user.problemSolved,
      recentSubmissions: recentSubmissions.map(sub => ({
        _id: sub._id,
        problem: {
          _id: sub.problemId._id,
          title: sub.problemId.title,
          difficulty: sub.problemId.difficulty
        },
        status: sub.status,
        runtime: sub.runtime,
        memory: sub.memory,
        submittedAt: sub.createdAt
      })),
      rank: {
        // You can implement ranking system later
        global: null,
        percentile: null
      }
    };
    
    res.status(200).json(profile);
    
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const getUserSolvedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate({
        path: 'problemSolved',
        select: '_id title difficulty tags'
      })
      .select('problemSolved');
    
    res.status(200).json({
      count: user.problemSolved.length,
      problems: user.problemSolved
    });
    
  } catch (error) {
    console.error("Solved problems error:", error);
    res.status(500).json({ error: "Failed to fetch solved problems" });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query; // Default 30 days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get daily submission counts
    const dailyActivity = await Submission.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          submissions: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get activity by hour (for heatmap)
    const hourlyActivity = await Submission.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: "$createdAt" },
            dayOfWeek: { $dayOfWeek: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      dailyActivity,
      hourlyActivity,
      period: `${days} days`
    });
    
  } catch (error) {
    console.error("Activity error:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    
    // Fields that can be updated
    const allowedUpdates = ['firstName', 'lastName', 'age'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
    
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  getUserProfile,
  getUserSolvedProblems,
  getUserActivity,
  updateUserProfile
};