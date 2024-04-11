import Rank from '../../schemas/Rank.js';
import determineTopTen from '../../utils/determineTopTen.js';
import { ApplicationCommandOptionType,  EmbedBuilder } from 'discord.js';

const addCommand = {
    name: "leaderboard",
    description: "look at the leaderboard!",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [
        {
            name: "server-id",
            description: "server to be wiped",
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {

        let guildId = interaction.options.getString('server-id');

        // Set guildId to test-server-id if it hasn't been input
        if (!guildId) {
            guildId = interaction.guild.id;
        }

        try {
            await interaction.deferReply(); // defer the initial reply

            const players = await determineTopTen(guildId);

            if (players.length === 0) {
                await interaction.followUp('There are no users in this server.');
            }
            
            else {

                const leaderboardEmbed = new EmbedBuilder()
                .setTitle("Leaderboard")
                .addFields(
                    { name: 'Position', value: players.map((_, index) => `${index === 0 ? '1 <:hammer:1221908675980038266> ' : index + 1}`).join('\n'), inline: true },
                    { name: 'Name', value: players.map(player => player.username).join('\n'), inline: true },
                    { name: 'SR Rating', value: players.map(player => player.SR.toString()).join('\n'), inline: true },
                )
                .setColor('#0099ff') 
                .setTimestamp(); 
                await interaction.followUp({ embeds: [leaderboardEmbed] });

            }
            
        } catch (error) {
            console.error("Failed to check leaderboard:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;