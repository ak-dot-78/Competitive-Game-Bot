import Player from '../schemas/Player.js';

const determineNewRank = (SR) => {
    if (SR >= 1500) return 'Master';
    if (SR >= 1400) return 'Sergeant';
    if (SR >= 1300) return 'Lieutenant';
    if (SR >= 1200) return 'Ensign';
    if (SR >= 1100) return 'Cadet';
    return 'NTF Agent'; 
};

export default async (userId, guildId, seasonId, isDefault) => {
    const user = await Player.findOne({ userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault });
    if (!user) return; 
    const newRank = determineNewRank(user.SR);
    if (user.rank !== newRank) {
        await Player.findOneAndUpdate(
            { userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault },
            { $set: { rank: newRank } },
            { new: true }
        );
    }
};