import Rank from '../schemas/Rank.js';

export default async (arr, guildId, isAgent) => {

    if (isAgent) {
        arr.forEach(async e => {
            const user = Rank.findOne({userID: e.player.user.id, guildID: guildId});
            const newNum = e.didWin ? [user.agentWins + 1, user.agentLosses] : [user.agentWins, user.agentLosses + 1];
            await Rank.findOneAndUpdate(
                {userID: e, guildID: guildId},
                { $set: { agentWins: newNum[0], agentLosses: newNum[1]}}
            );
        });
    }

    else {
        arr.forEach(async e => {
            const user = Rank.findOne({userID: e.player.user.id, guildID: guildId});
            const newNum = e.didWin ? [user.hackerWins + 1, user.hackerLosses] : [user.hackerWins, user.hackerLosses + 1];
            await Rank.findOneAndUpdate(
                {userID: e, guildID: guildId},
                { $set: { hackerWins: newNum[0], hackerLosses: newNum[1]}}
            );
        });
    }
};