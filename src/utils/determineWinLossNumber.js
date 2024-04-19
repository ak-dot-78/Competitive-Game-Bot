import Player from '../schemas/Player.js';

export default async (userId, guildId, seasonId, win) => {
    const user = await Player.findOne({ userID: userId, guildID: guildId, season: seasonId});
    
    if (win) {
        const newWin = user.gamesWon + 1;
        await Player.findOneAndUpdate(
            { userID: userId, guildID: guildId, season: seasonId },
            { $set: { gamesWon: newWin } },
            { new: true }
        );  
    }

    else {
        const newLoss = user.gamesLost + 1;
        await Player.findOneAndUpdate(
        { userID: userId, guildID: guildId, season: seasonId },
        { $set: { gamesLost: newLoss} },
        { new: true }
        );
    }
};