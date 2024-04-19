import Player from '../schemas/Player.js';

export default async (guildId, seasonId) => {
    const players = await Player.find({ guildID: guildId, season: seasonId }).sort({ SR: -1 });

    if (players.length <= 10) {
        return players;
    }

    else {
        const topTen = players.slice(0, 10);
        return topTen;
    }

};