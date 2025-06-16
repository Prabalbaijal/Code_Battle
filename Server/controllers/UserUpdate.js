import { User } from "../models/Usermodel.js";

export const updateUserData = async (winnerUsername, loserUsername) => {
    try {
        console.log(winnerUsername)
        console.log(loserUsername)
        const winner = await User.findOne({ username: winnerUsername });
        const loser = await User.findOne({ username: loserUsername });

        if (winner && loser) {
            // Update coins
            winner.coins += 50;
            loser.coins -= 50;
            if(loser.coins<0) loser.coins=0;

            // Update levels
            winner.level = getLevelFromCoins(winner.coins);
            loser.level = getLevelFromCoins(loser.coins);

            await winner.save();
            await loser.save();

            console.log(`Updated winner (${winnerUsername}): coins=${winner.coins}, level=${winner.level}`);
            console.log(`Updated loser (${loserUsername}): coins=${loser.coins}, level=${loser.level}`);
        } else {
            console.log(`User data not found for winner: ${winnerUsername} or loser: ${loserUsername}`);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
    }
};



export const updateUserDataOnNoWinner = async (user1Username, user2Username) => {
  try {
    const [user1, user2] = await Promise.all([
      User.findOne({ username: user1Username }),
      User.findOne({ username: user2Username })
    ]);

    if (user1 && user2) {
      user1.coins = Math.max(0, user1.coins - 50);
      user2.coins = Math.max(0, user2.coins - 50);

      user1.level = getLevelFromCoins(user1.coins);
      user2.level = getLevelFromCoins(user2.coins);


      user1.save();
      user2.save();

      console.log(`No winner. Deducted coins: ${user1.username} (${user1.coins}), ${user2.username} (${user2.coins})`);
    } else {
      console.log(`User not found: ${user1Username} or ${user2Username}`);
    }
  } catch (error) {
    console.error(`Error updating user data on no winner:`, error.message);
  }
};

function getLevelFromCoins(coins) {
    if (coins < 500) return 1;
    else if (coins < 900) return 2;
    else if (coins < 1000) return 3;
    return 4;
}
