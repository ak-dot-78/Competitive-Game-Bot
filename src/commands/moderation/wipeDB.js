import Player from '../../schemas/Player.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import config from '../../../config.json' assert { type: 'json' };
import wipeDB from '../../utils/wipeDB.js';
const { testServer } = config; // experimental possible bug

const addCommand = {
    name: "wipe-database",
    description: "wipe database for a specific server (default: test server)",
    devOnly: true,
    // testOnly: Boolean, 
    permissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "server-id",
            description: "server to be wiped",
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {

        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }
        
        let guildId = interaction.options.getString('server-id');

        // Set guildId to test-server-id if it hasn't been input
        if (!guildId) {
            guildId = interaction.guild.id;
        }
    
        try {

            wipeDB(guildId);
            console.log(`Wiped database for users in guild: ${guildId}`);
            await interaction.reply({ content: `Wiped database for users in guild: ${guildId}`, ephemeral: true });

        } catch (error) {
            console.error("Failed to add user:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;