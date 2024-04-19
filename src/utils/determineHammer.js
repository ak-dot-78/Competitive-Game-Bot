import Player from '../schemas/Player.js';

export default async (guildId, seasonId) => {
    await Player.updateMany(
        { guildID: guildId, season: seasonId },
        { $set: { hammer: false } },
        { new: true }
    );
    const players = await Player.find({ guildID: guildId, season: seasonId }).sort({ SR: -1 });
    const currHammers = players.filter(e => e.SR === Math.max(...players.map(e => e.SR)));
    currHammers.forEach(async e => 
        await Player.updateOne(
            { userID: e.userID, guildID: guildId, season: seasonId },
            { $set: { hammer: true } },
            { new: true }
        )
    );
};