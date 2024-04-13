import Rank from '../../schemas/Rank.js';
import mongoose from 'mongoose';
import determineHammer from '../../utils/determineHammer.js';
import determineRank from '../../utils/determineRank.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import determineWinLossNumber from '../../utils/determineWinLossNumber.js';
import determineLastPlayed from '../../utils/determineLastPlayed.js';

const SR_CHANGE = 25; // Can be changed

const addCommand = {
    name: "update",
    description: "update SRs from a recent game",
    permissions: PermissionFlagsBits.Administrator,
    // devOnly: true,
    // testOnly: Boolean, 
    options: [
        {
            name: "gamemode",
            description: "mainframe? blind hackers? normal? hacker vc? blitz? timer?",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Normal", value: "normal"},
                { name: "Blind Hackers", value: "blindHackers"},
                { name: "Mainframe", value: "mainframe"},
                { name: "Hacker VC", value: "hackerVc"},
                { name: "Blitz", value: "blitz"},
                { name: "Timer", value: "timer"}
            ],
            required: false
        },
        {
            name: "player-1",
            description: "player 1",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "win-loss-1",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
        },
        {
            name: "player-2",
            description: "player 2",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
            
        },
        {
            name: "win-loss-2",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
        },
        {
            name: "player-3",
            description: "player 3",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "win-loss-3",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
        },
        {
            name: "player-4",
            description: "player 4",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "win-loss-4",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
        },
        {
            name: "player-5",
            description: "player 5",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "win-loss-5",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
        },
        {
            name: "player-6",
            description: "player 6",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
        {
            name: "win-loss-6",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: false,
        },
        {
            name: "player-7",
            description: "player 7",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
        {
            name: "win-loss-7",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: false,
        },
        {
            name: "player-8",
            description: "player 8",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
        {
            name: "win-loss-8",
            description: "+25 SR for win, -25 SR for loss",
            type: ApplicationCommandOptionType.String, 
            choices: [
                { name: "Win", value: "win" },
                { name: "Loss", value: "loss" }
            ],
            required: true,
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
                await determineWinLossNumber(userId, guildId, winLossOption === "win" ? true : false, isAgent);
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





