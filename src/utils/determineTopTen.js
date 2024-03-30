import Rank from '../schemas/Rank.js';

export default async (guildId) => {
    const players = await Rank.find({ guildID: guildId }).sort({ SR: -1 });

    if (players.length <= 10) {
        return players;
    }

    else {
        const topTen = players.slice(0, 10);
        return topTen;
    }

};