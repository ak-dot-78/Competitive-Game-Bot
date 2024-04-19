import Player from '../schemas/Player.js';

export default async (arr, guildId, seasonId, isAgent) => {
    for (const e of arr) {
        const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: seasonId });

        if (isAgent) {
            const newNum = e.didWin ? [user.agentWins + 1, user.agentLosses] : [user.agentWins, user.agentLosses + 1];
            const updateQuery = { agentWins: newNum[0], agentLosses: newNum[1] };
           
            await Player.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId, season: seasonId },
                { $set: updateQuery }
            );
        }
        else {
            const newNum = e.didWin ? [user.hackerWins + 1, user.hackerLosses] : [user.hackerWins, user.hackerLosses + 1];
            const updateQuery = { hackerWins: newNum[0], hackerLosses: newNum[1] };
           
            await Player.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId, season: seasonId },
                { $set: updateQuery }
            );
        }
    }
};