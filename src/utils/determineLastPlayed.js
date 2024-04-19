import Player from '../schemas/Player.js';

export default async (userId, guildId, seasonId, timestamp) => {
    
    await Player.findOneAndUpdate(
        { userID: userId, guildID: guildId, season: seasonId },
        { $set: { lastGamePlayed: timestamp } },
        { new: true }
    );

};