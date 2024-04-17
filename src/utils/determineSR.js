import Rank from '../schemas/Rank.js';

export default async (client, userId, guildId, didWin) => { // players is an array of user options
    const userObj = await client.users.fetch(userId);
    // find user's SR, update it or insert with default SR if it doesn't exist
    const user = await Rank.findOneAndUpdate(
        { userID: userId, guildID: guildId },
        { $setOnInsert: {username: userObj.username} },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    

    const SR_CHANGE = 25;
    let srChange = didWin ? SR_CHANGE : -SR_CHANGE;

    if (user.SR < 1400 && user.SR % 100 === 0 && srChange < 0) { 
        srChange = 0;
    }

    let newSR = user.SR + srChange;

    // update the SR in the database
    await Rank.findOneAndUpdate(
        { userID: userId, guildID: guildId },
        { $set: { SR: newSR } },
        { new: true }
    );
};