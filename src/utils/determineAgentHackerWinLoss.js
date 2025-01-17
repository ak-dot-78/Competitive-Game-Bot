import Player from '../schemas/Player.js';

export default async (arr, guildId, seasonId, agentsWon, isDefault) => {
    for (const e of arr) {
        const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: seasonId, gameDef:isDefault });

        if (agentsWon) {
            const newNum = e.didWin ? [user.agentWins + 1, user.hackerLosses] : [user.agentWins, user.hackerLosses + 1];
            const updateQuery = { agentWins: newNum[0], hackerLosses: newNum[1] };
           
            await Player.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId, season: seasonId, gameDef: isDefault },
                { $set: updateQuery }
            );
        }
        else {
            const newNum = e.didWin ? [user.hackerWins + 1, user.agentLosses] : [user.hackerWins, user.agentLosses + 1];
            const updateQuery = { hackerWins: newNum[0], agentLosses: newNum[1] };
           
            await Player.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId, season: seasonId, gameDef: isDefault },
                { $set: updateQuery }
            );
        }
    }
};