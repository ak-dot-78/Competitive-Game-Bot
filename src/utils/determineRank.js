import Rank from '../schemas/Rank.js';

const determineNewRank = (SR) => {
    if (SR >= 1500) return 'Master';
    if (SR >= 1400) return 'Sergeant';
    if (SR >= 1300) return 'Lieutenant';
    if (SR >= 1200) return 'Ensign';
    if (SR >= 1100) return 'Cadet';
    return 'NTF Agent'; 
};

export default async (userId, guildId) => {
    const user = await Rank.findOne({ userID: userId, guildID: guildId });
    if (!user) return; 
    const newRank = determineNewRank(user.SR);
    if (user.rank !== newRank) {
        await Rank.findOneAndUpdate(
            { userID: userId, guildID: guildId },
            { $set: { rank: newRank } },
            { new: true }
        );
    }
};