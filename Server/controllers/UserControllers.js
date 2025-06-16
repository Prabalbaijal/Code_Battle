import { User } from '../models/Usermodel.js'
import { Contest } from '../models/ContestModel.js';

export const recordAttempt=async (req, res) => {
    const { userId, questionId } = req.body;

    try {
        // Check if the attempt already exists to avoid duplicates
        const existingAttempt = await Attempt.findOne({ userId, questionId });
        if (existingAttempt) {
            return res.status(200).json({ message: 'Attempt already recorded' });
        }

        // Record new attempt
        const newAttempt = new Attempt({ userId, questionId });
        await newAttempt.save();

        res.json({ message: 'Attempt recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording attempt', error });
    }
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's basic info
    const user = await User.findById(userId).select("level coins username");
    if (!user) return res.status(404).json({ message: "User not found" });

    const username = user.username;

    // Get completed contests where this user played
    const contests = await Contest.find({
      status: "completed",
      $or: [{ user1: username }, { user2: username }],
    })
      .sort({ endTime: -1 });

    // Format matchHistory with opponent's username
    const formattedMatchHistory = contests.map((contest) => {
      const isUser1 = contest.user1 === username;
      const opponentUsername = isUser1 ? contest.user2 : contest.user1;
      // console.log(contest)
      const result =
        contest.winner === null
          ? "draw"
          : contest.winner === username
          ? "win"
          : "lose";

      const score = result === "win" ? 50 : result === "lose" ? -50 : 0;

      return {
        opponent: opponentUsername, 
        result,
        score,
        date: contest.endTime || contest.startTime,
      };
    });

    res.json({
      level: user.level,
      coins: user.coins,
      matchHistory: formattedMatchHistory,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUsers = async (req, res) => {
    try {
      const query = req.query.query;
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }
  
      // Case-insensitive regex search
      const users = await User.find({
        username: { $regex: query, $options: 'i' },
      })
        .select('_id username fullname avatar')
        .limit(10);
  
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error in searchUsers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };