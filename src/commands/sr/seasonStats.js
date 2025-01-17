import determineTopTen from '../../utils/determineTopTen.js';
import { ApplicationCommandOptionType,  EmbedBuilder } from 'discord.js';
import displaySeasonName from '../../utils/displaySeasonName.js';
import dotenv from 'dotenv';
import Game from '../../schemas/Game.js'
dotenv.config();

const addCommand = {
    name: "seasonstats",
    description: "season stats",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [

        {
            name: "gamemode",
            description: "mainframe? blind hackers? normal? hacker vc? blitz? timer?",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Default", value: "default"},
                { name: "Party", value: "party"}
            ],
            required: true
        },
        {
            name: "season-id",
            description: "it's the season dawg",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Lifetime", value: "lifetime"},
                { name: "pre-season", value: "0000" },
                { name: "season-1", value: "0001" },
                { name: "season-2", value: "0002"},
                { name: "season-3", value: "0003"}
            ]
        }
    ],
    callback: async (client, interaction) => {

        const guildId = interaction.guildId;
        let seasonId = interaction.options.getString('season-id');
        let gameMode = interaction.options.getString("gamemode");

        let isDefault = true;

        if (gameMode === "party") {
            isDefault = false;
        }

        if (!seasonId) {
            // eslint-disable-next-line no-undef
            seasonId = process.env.CURRENT_SEASON;
        }


        try {
            await interaction.deferReply(); // defer the initial reply

            const stats = await Game.find({season: seasonId, guildID: guildId, gameDef: isDefault})
            console.log(stats);
            const displayName = displaySeasonName(seasonId, isDefault);
            
            const statsEmbed = new EmbedBuilder()
            .setTitle(`${displayName} Stats`)
            .addFields(
                { name: 'Total Games', value: stats.totalGames, inline: true },
                { name: 'Agent Wins', value: stats.agentWins, inline: true },
                { name: 'Agent Winrate', value: `${(stats.agentWins * 100 / stats.totalGames).toFixed(2)}%`, inline: true }, // Added comma here
                { name: 'Hacker Wins', value: stats.hackerWins, inline: true },
                { name: 'Hacker Winrate', value: `${(stats.hackerWins * 100 / stats.totalGames).toFixed(2)}%`, inline: true } // Corrected typo and added percentage formatting
            )
            .setColor('#0099ff')
            .setTimestamp();
            await interaction.followUp({ embeds: [statsEmbed] });
            console.log("Replied with season stats.");
            
        } catch (error) {
            console.error("Failed to check leaderboard:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;