import Rank from '../schemas/Rank.js';

export default async (userId, guildId, win) => {
    const user = await Rank.findOne({ userID: userId, guildID: guildId });
    
    if (win) {
        const newWin = user.gamesWon + 1;
        await Rank.findOneAndUpdate(
            { userID: userId, guildID: guildId },
            { $set: { gamesWon: newWin } },
            { new: true }
        );  
    }

    else {
        const newLoss = user.gamesLost + 1;
        await Rank.findOneAndUpdate(
        { userID: userId, guildID: guildId },
        { $set: { gamesLost: newLoss} },
        { new: true }
        );
    }
};