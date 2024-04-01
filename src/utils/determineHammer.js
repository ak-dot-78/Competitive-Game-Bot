import Rank from '../schemas/Rank.js';

export default async (guildId) => {
    await Rank.updateMany(
        { guildID: guildId },
        { $set: { hammer: false } },
        { new: true }
    );
    const players = await Rank.find({ guildID: guildId }).sort({ SR: -1 });
    const currHammers = players.filter(e => e.SR === Math.max(...players.map(e => e.SR)));
    currHammers.forEach(async e => 
        await Rank.updateOne(
            { userID: e.userID, guildID: guildId },
            { $set: { hammer: true } },
            { new: true }
        )
    );
};