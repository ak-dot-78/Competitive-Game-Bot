import Rank from '../schemas/Rank.js';

function findHighestEqual(arr) {
    const output = [];
    let highest = arr[0].SR;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].SR === highest) {
            output.push(arr[i]);
        }
        else { break;}
    }
    return output;
}

export default async (guildId) => {
    const players = await Rank.find({ guildID: guildId }).sort({ SR: -1 });
    const currHammers = findHighestEqual(players);

    for (let i = 0; i < currHammers.length; i++) {
        await Rank.findOneAndUpdate(
            { userID: currHammers[i].userID, guildID: guildId },
            { $set: { hammer: true } },
            { new: true }
        );
    }
};