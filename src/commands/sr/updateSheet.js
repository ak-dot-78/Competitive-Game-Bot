/* eslint-disable no-unused-vars */
import Player from '../../schemas/Player.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const addCommand = {
    name: "updatesheet",
    description: "update google sheet",
    devOnly: true,
    // testOnly: Boolean, 
    // permissions: PermissionFlagsBits.Administrator,
    options: [
    ],
    callback: async (client, interaction) => {
        const guildId = interaction.guild.id;
        try {
            await interaction.deferReply(); // Defer the initial reply
            // const lifetimePlayers = await Player.find({ guildID: guildId, season: 'lifetime' });
            // const preSeasonPlayers = await Player.find({ guildID: guildId, season: '0000' });
            // const seasonOnePlayers = await Player.find({ guildID: guildId, season: '0001' });
            const seasonTwoPlayers = await Player.find({ guildID: guildId, season: '0002' });

            // Sort players by SR in descending order
            const sortBySRDesc = (a, b) => b.SR - a.SR;

            function truncateToTwoDecimals(number) {
                return Math.floor(number * 100) / 100;
            }

            const sortedSeasonTwoPlayers = seasonTwoPlayers.sort(sortBySRDesc);

            // for (const user of sortedSeasonTwoPlayers) {
            
            //     const userData = {
            //         UserId: user.userID,
            //         PlayerName: user.username,
            //         SR: user.SR,
            //         Rank: user.rank,
            //         Wins: user.gamesWon,
            //         Losses: user.gamesLost,
            //         GamesPlayed: user.gamesWon + user.gamesLost,
            //         WinRate: truncateToTwoDecimals((user.gamesWon / (user.gamesWon + user.gamesLost)) * 100),
            //         AgentWins: user.agentWins,
            //         AgentLosses: user.agentLosses,
            //         AgentGames: user.agentWins + user.agentLosses,
            //         AgentWinrate: truncateToTwoDecimals((user.agentWins / (user.agentWins + user.agentLosses)) * 100),
            //         HackerWins: user.hackerWins,
            //         HackerLosses: user.hackerLosses,
            //         HackerGames: user.hackerWins + user.hackerLosses,
            //         HackerWinrate: truncateToTwoDecimals((user.hackerWins / (user.hackerWins + user.hackerLosses)) * 100)
            //     };

            //     await axios.post('https://sheetdb.io/api/v1/cf0fmt3dglcu4', {
            //         data: userData // Wrap in an array
            //     });
            
            //     console.log("userData:", userData); // Debugging line to ensure data is correct
        
            // }
            interaction.followUp({ content: "logged data.", ephemeral: true });
            
        } catch (error) {
            console.error("Failed to add user:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;