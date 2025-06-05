import { User } from '../models/Usermodel.js'


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

        // Fetch user data and populate opponent details
        const user = await User.findById(userId, "level coins matchHistory")
            .populate({
                path: "matchHistory.opponent",  // Populate opponent field
                select: "username"  // Only fetch username
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format matchHistory to ensure opponent's username is sent instead of ID
        const formattedMatchHistory = user.matchHistory.map(match => ({
            ...match.toObject(),
            opponent: match.opponent?.username || "Unknown"  // Ensure username is returned
        }));

        res.json({
            level: user.level,
            coins: user.coins,
            matchHistory: formattedMatchHistory
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