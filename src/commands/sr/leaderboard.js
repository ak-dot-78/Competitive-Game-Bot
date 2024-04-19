import determineTopTen from '../../utils/determineTopTen.js';
import { ApplicationCommandOptionType,  EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "leaderboard",
    description: "look at the leaderboard! (default: current season)",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [

        {
            name: "season-id",
            description: "it's the season dawg",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Lifetime", value: "lifetime"},
                { name: "pre-season", value: "0000" },
                { name: "season-1", value: "0001" }
            ]
        }
    ],
    callback: async (client, interaction) => {

        const guildId = interaction.guildId;
        let seasonId = interaction.options.getString('season-id');

        if (!seasonId) {
            seasonId = process.env.CURRENT_SEASON;
        }


        try {
            await interaction.deferReply(); // defer the initial reply

            const players = await determineTopTen(guildId, seasonId);

            if (players.length === 0) {
                await interaction.followUp('There are no users in this server.');
            }
            
            else {

                const leaderboardEmbed = new EmbedBuilder()
                .setTitle(`Season ${seasonId} Leaderboard`)
                .addFields(
                    { name: 'Position', value: players.map((_, index) => `${index === 0 ? '1 <:hammer:1221908675980038266>' : index + 1}`).join('\n'), inline: true },
                    { name: 'Name', value: players.map(player => player.username).join('\n'), inline: true },
                    { name: 'SR Rating', value: players.map(player => player.SR.toString()).join('\n'), inline: true },
                )
                .setColor('#0099ff') 
                .setTimestamp(); 
                await interaction.followUp({ embeds: [leaderboardEmbed] });
                console.log("Replied with leaderboard stats.");

            }
            
        } catch (error) {
            console.error("Failed to check leaderboard:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;