import { startSession } from "mongoose";
import { Contest } from "../models/ContestModel.js";
import { contestUsers, unSocketMap, updateOnlineUsers } from '../socket/socket.js'
import { updateUserDataOnNoWinner } from './UserUpdate.js'

export const scheduleContestTimeout = (roomName, endTime) => {
    const timeRemaining = endTime - Date.now();

    if (timeRemaining <= 0) return; // If already expired, exit.

    setTimeout(async () => {
        const contest = await Contest.findOne({ roomName, status: "active" });

        if (contest) {
            const { user1, user2 } = contest;

            // Notify users
            [user1, user2].forEach((user) => {
                const usersocket=unSocketMap.get(user)
                if (usersocket) {
                    usersocket.emit('contestEnded',{
                        winner:'Nobody',
                        message:'Nobody won.Time Up!!'
                    })
                }
            });
            const session=await startSession()
            session.startTransaction()
            await updateUserDataOnNoWinner(user1,user2,session)

            // Remove contest from DB
            contestUsers.delete(user1);
            contestUsers.delete(user2);
            updateOnlineUsers()
            await Contest.findOneAndUpdate({ roomName,status:'active' },{status:'completed'},{ new: false, session });
            console.log(`Contest ${roomName} ended due to timeout.`);
        }
    }, timeRemaining);
};

export const rescheduleAllTimeouts = async () => {
    try {
        const activeContests = await Contest.find({ status: "active" });

        activeContests.forEach((contest) => {
            scheduleContestTimeout(contest.roomName, contest.endTime);
        });

        console.log(`Rescheduled ${activeContests.length} contest timeouts.`);
    } catch (error) {
        console.error(" Error rescheduling contests:", error);
    }
};
export const getActiveContests=async (req, res) => {
    try {
        const { username } = req.body; // Get username from request body

        // Find active contests where user is either user1 or user2
        const contests = await Contest.find({
            $or: [{ user1: username }, { user2: username }],
            status: "active"
        }).select("roomName user1 user2 endTime");

        // Process contests to determine opponent names without extra DB calls
        const contestsWithOpponent = contests.map(contest => ({
            roomName: contest.roomName,
            endTime: contest.endTime,
            opponentName: contest.user1 === username ? contest.user2 : contest.user1, // Determine opponent directly
        }));

        res.json(contestsWithOpponent);
    } catch (error) {
        console.error("Error fetching active contests:", error);
        res.status(500).json({ message: "Server error" });
    }
}