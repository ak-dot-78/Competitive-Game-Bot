import Player from '../schemas/Player.js';

export default async (userId, guildId, seasonId, timestamp, isDefault) => {
    
    await Player.findOneAndUpdate(
        { userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault },
        { $set: { lastGamePlayed: timestamp } },
        { new: true }
    );

};