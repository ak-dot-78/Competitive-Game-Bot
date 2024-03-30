import Rank from '../schemas/Rank.js';

export default async (userId, guildId, timestamp) => {
    
    await Rank.findOneAndUpdate(
        { userID: userId, guildID: guildId },
        { $set: { lastGamePlayed: timestamp } },
        { new: true }
    );

};