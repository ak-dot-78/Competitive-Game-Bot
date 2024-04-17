import Rank from '../schemas/Rank.js';

export default async (arr, guildId, isAgent) => {
    for (const e of arr) {
        const user = await Rank.findOne({ userID: e.player.user.id, guildID: guildId });

        if (isAgent) {
            const newNum = e.didWin ? [user.agentWins + 1, user.agentLosses] : [user.agentWins, user.agentLosses + 1];
            const updateQuery = { agentWins: newNum[0], agentLosses: newNum[1] };
           
            await Rank.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId },
                { $set: updateQuery }
            );
        }
        else {
            const newNum = e.didWin ? [user.hackerWins + 1, user.hackerLosses] : [user.hackerWins, user.hackerLosses + 1];
            const updateQuery = { hackerWins: newNum[0], hackerLosses: newNum[1] };
           
            await Rank.findOneAndUpdate(
                { userID: e.player.user.id, guildID: guildId },
                { $set: updateQuery }
            );
        }
    }
};