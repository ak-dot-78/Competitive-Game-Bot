// eslint-disable-next-line no-unused-vars
import Player from '../../schemas/Player.js';
import Game from '../../schemas/Game.js';
// eslint-disable-next-line no-unused-vars
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "addseason",
    description: "add a season tracker",
    devOnly: true,
    // testOnly: Boolean, 
    // permissions: PermissionFlagsBits.Administrator,
    callback: async (client, interaction) => {
        // eslint-disable-next-line no-undef
        const seasonNumber = process.env.CURRENT_SEASON;
        const guildId = interaction.guild.id;

        try {
            await interaction.deferReply(); // defer the initial reply
            const newGame = new Game({
                season: seasonNumber,
                guildID: guildId,
                // totalGames, agentWins, hackerWins will use default values
            });
    
            // Save the new game entry to the database
            await newGame.save();
            interaction.followUp("added");
            }
        catch (error) {
            console.error("Failed to add user:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;