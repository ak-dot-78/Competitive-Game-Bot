/* eslint-disable no-undef */
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import Player from '../../schemas/Player.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "srchange",
    description: "increases SR of given player by given amount",
    devOnly: true,
    testOnly: false, 
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: "player",
            description: "player to affect",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "amount",
            description: "amount to increase",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }
        try {
            await interaction.deferReply(); // defer the initial reply


            const player = interaction.options.getMentionable(`player`);
            const amount = +interaction.options.getString(`amount`);
            const guildId = interaction.guild.id;
            const userId = player.id;

            const user = await Player.findOne({ userID: userId, guildID: guildId, season: process.env.CURRENT_SEASON });

            const newSR = user.SR + amount;

            await Player.findOneAndUpdate(
                { userID: userId, guildID: guildId, season: process.env.CURRENT_SEASON},
                { $set: { SR: newSR } },
                { new: true }
            );

            await Player.findOneAndUpdate(
                { userID: userId, guildID: guildId, season: "lifetime"},
                { $set: { SR: newSR } },
                { new: true }
            );
            
            if (amount > 0) {
                await interaction.followUp(user.username + "'s SR increased by " + amount);
            }
            if (amount < 0) {
                await interaction.followUp(user.username + "'s SR decreased by " + (-1 * amount));
            }
            if (amount === 0) {
                await interaction.followUp(user.username + "'s SR not changed");
            }

            console.log("performed sr change for player, current and lifetime")
        } catch (error) {
            console.error("Failed to srchange: ", error);
            await interaction.reply({ content: "boing did not work", ephemeral: false });
        }
    }
};

export default addCommand;





