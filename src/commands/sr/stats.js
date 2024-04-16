import Rank from '../../schemas/Rank.js';
import mongoose from 'mongoose';
import determineHammer from '../../utils/determineHammer.js';
import determineRank from '../../utils/determineRank.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import determineWinLossNumber from '../../utils/determineWinLossNumber.js';
import determineLastPlayed from '../../utils/determineLastPlayed.js';

const SR_CHANGE = 25; // Can be changed

const addCommand = {
    name: "stats",
    description: "displays a player's stats",
    permissions: PermissionFlagsBits.Administrator,
    devOnly: true,
    testOnly: false, 
    options: [
        {
            name: "player",
            description: "player whose stats will be shown",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        }
    ],
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply(); // defer the initial reply
            let feedback = '';
            for (let i = 0; i < 5; i++) {
                let playerOption = interaction.options.getMentionable(`player-${i+1}`);
                let winLossOption = interaction.options.getString(`win-loss-${i+1}`);

                let srChange = winLossOption === "win" ? SR_CHANGE : -SR_CHANGE;
                let userId = playerOption.user.id;
                let guildId = interaction.guild.id;
                let userObj = await client.users.fetch(userId);

                // find user's SR, update it or insert with default SR if it doesn't exist.
                let user = await Rank.findOneAndUpdate(
                    { userID: userId, guildID: guildId },
                    { $setOnInsert: {username: userObj.username} },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

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

                const timestamp = new Date();

                await determineRank(userId, guildId);
                await determineHammer(guildId);
                await determineWinLossNumber(userId, guildId, winLossOption === "win" ? true : false);
                await determineLastPlayed(userId, guildId, timestamp);

                // provide feedback for each player's update
                feedback += `Updated SR for ${userObj.username}. You now have: ${newSR}\n`
            }
            await interaction.followUp({
                content: feedback + `Successfully updated SR for all players`,
            });
        } catch (error) {
            console.error("Failed to update SR:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }

};

export default addCommand;





