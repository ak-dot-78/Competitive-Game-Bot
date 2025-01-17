import Player from '../schemas/Player.js';

export default async (client, userId, guildId, seasonId, didWin, isDefault) => { // players is an array of user options
    const userObj = await client.users.fetch(userId);
    // find user's SR, update it or insert with default SR if it doesn't exist
    const user = await Player.findOneAndUpdate(
        { userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault },
        { $setOnInsert: {username: userObj.username} },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let srChange = 0;

    // const SR_CHANGE = 25;
    // let srChange = didWin ? SR_CHANGE : -SR_CHANGE;
    // if (user.SR < 1400 && user.SR % 100 === 0 && srChange < 0) { 
    //     srChange = 0;
    // } STUFF FOR PRESEASON

    if (didWin) { // PLAYER WON
        if (user.rank === "NTF Agent") {
            srChange = 40;
        }
        if (user.rank === "Cadet" || user.rank === "Ensign" || user.rank === "Lieutenant") {
            srChange = 30;
        }
        if (user.rank === "Sergeant" || user.rank === "Master") {
            srChange = 25;
        }
    }

    else { // PLAYER LOST
        if (user.SR >= 1500 || user.SR % 100 >= 20) { 
            srChange = -20;
        }
        else {
            srChange = -(user.SR % 100);
        }
    }

    let newSR = user.SR + srChange;
        await Player.findOneAndUpdate(
            { userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault},
            { $set: { SR: newSR } },
            { new: true }
        );
};