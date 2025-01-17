/* eslint-disable no-undef */
import Player from '../../schemas/Player.js';
import Game from '../../schemas/Game.js';
import determineHammer from '../../utils/determineHammer.js';
import determineRank from '../../utils/determineRank.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import determineWinLossNumber from '../../utils/determineWinLossNumber.js';
import determineLastPlayed from '../../utils/determineLastPlayed.js';
import determineWinnersLosers from '../../utils/determineWinnersLosers.js';
import determineAgentHackerWinLoss from '../../utils/determineAgentHackerWinLoss.js';
import determineSR from '../../utils/determineSR.js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const addCommand = {
    name: "update",
    description: "update SRs from a recent game",
    permissions: PermissionFlagsBits.Administrator,
    devOnly: false,
    // testOnly: Boolean, 
    options: [
        {
            name: "player-1",
            description: "player 1",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "win-loss-1",
            description: "+SR for win, -SR for loss",
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
            required: false,
        },
        {
            name: "gamemode",
            description: "mainframe? blind hackers? normal? hacker vc? blitz? timer?",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Default", value: "default"},
                { name: "Blind Hackers", value: "blindHackers"},
                { name: "Mainframe", value: "mainframe"},
                { name: "Hacker VC", value: "hackerVc"},
                { name: "Blitz", value: "blitz"},
                { name: "Timer", value: "timer"}
            ],
            required: false
        },
        {
            name: "test",
            description: "dev only",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "True", value: "true"},
                { name: "False", value: "false"},
            ],
            required: false
        },
    ],
    callback: async (client, interaction) => { 
        try {

            // Check if the user has administrator permissions
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
                }


            let gameMode = interaction.options.getString("gamemode");
            if (!gameMode) {
                gameMode = "default";
            }
            
            let isDefault = true;

            if (gameMode != "default") {
                isDefault = false;
            }
            const guildId = interaction.guild.id;
            const options = [
                {player: "player-1",
                wLOpt: "win-loss-1"},
                {player: "player-2",
                wLOpt: "win-loss-2"},
                {player: "player-3",
                wLOpt: "win-loss-3"},
                {player: "player-4",
                wLOpt: "win-loss-4"},
                {player: "player-5",
                wLOpt: "win-loss-5"},
                {player: "player-6",
                wLOpt: "win-loss-6"},
                {player: "player-7",
                wLOpt: "win-loss-7"},
                {player: "player-8",
                wLOpt: "win-loss-8"}
            ];


            await interaction.deferReply(); // defer the initial reply
            let feedback = '';

            // class playerInfo to introduce player objects containing info about win/loss

            class playerInfo {
                constructor(player, didWin) {
                    this.player = player; // mentionable
                    this.didWin = didWin; // boolean
                }
            }

            const playerArr = [];

            for (let i = 0; i < options.length; i++){
                if (interaction.options.getMentionable(options[i].player) !== null) {
                    const didWin = interaction.options.getString(options[i].wLOpt) === "win" ? true : false;
                    const playerObj = new playerInfo(interaction.options.getMentionable(`${options[i].player}`), didWin);
                    playerArr.push(playerObj);
                }
            }
            let agentsWon = false; // bool to det if agents won

            const ret = determineWinnersLosers(playerArr);

            const winners = ret.winners;
            const losers = ret.losers;
           
            if (winners.length > losers.length) {
                agentsWon = true;
            }
            else {
                agentsWon = false;
            }
            for (const e of winners) {
                await determineSR(client, e.player.user.id, guildId, process.env.CURRENT_SEASON, true, isDefault);
                await determineWinLossNumber(e.player.user.id, guildId, process.env.CURRENT_SEASON, true, isDefault);
                await determineSR(client, e.player.user.id, guildId, "lifetime", true, isDefault);
                await determineWinLossNumber(e.player.user.id, guildId, "lifetime", true, isDefault);
            }
            for (const e of losers) {
                await determineSR(client, e.player.user.id, guildId, process.env.CURRENT_SEASON, false, isDefault);
                await determineWinLossNumber(e.player.user.id, guildId, process.env.CURRENT_SEASON, false, isDefault);
                await determineSR(client, e.player.user.id, guildId, "lifetime", false, isDefault);
                await determineWinLossNumber(e.player.user.id, guildId, "lifetime", false, isDefault);
            }
            await determineAgentHackerWinLoss(winners, guildId, process.env.CURRENT_SEASON, agentsWon, isDefault);
            await determineAgentHackerWinLoss(losers, guildId, process.env.CURRENT_SEASON, agentsWon, isDefault);
            await determineAgentHackerWinLoss(winners, guildId, "lifetime", agentsWon, isDefault);
            await determineAgentHackerWinLoss(losers, guildId, "lifetime", agentsWon, isDefault);
            winners.concat(...losers).forEach(e => {
                determineRank(e.player.user.id, guildId, process.env.CURRENT_SEASON, isDefault);
                const timestamp = new Date();
                determineLastPlayed(e.player.user.id, guildId, process.env.CURRENT_SEASON, timestamp, isDefault);
            });
            await determineHammer(guildId, process.env.CURRENT_SEASON, isDefault);
            await determineHammer(guildId, "lifetime", isDefault);
            for (const e of  winners.concat(...losers)) {
                const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON, gameDef: isDefault });
                feedback += `Updated SR for ${user.username}. You now have: ${user.SR}\n`; // provide feedback for each player's update
            }
            await interaction.followUp({
                content: feedback + `Successfully updated SR for all players`,
            });

            let seasonTracker = await Game.findOne({ guildID: guildId, season: process.env.CURRENT_SEASON, gameDef: isDefault });

            if (!seasonTracker) {
                // If no game entry exists, create a new one
                seasonTracker = new Game({
                    season: process.env.CURRENT_SEASON,
                    gameDef: isDefault,
                    guildID: guildId,
                    totalGames: 0,
                    agentWins: 0,
                    hackerWins: 0 
                });

                await seasonTracker.save();
                console.log('New game entry created successfully:', seasonTracker);
            }

            console.log(seasonTracker);

            // Update the game statistics
            const newTotal = seasonTracker.totalGames + 1;
            let newAW = seasonTracker.agentWins;
            let newHW = seasonTracker.hackerWins;

            if (agentsWon) {
                newAW++;
            } else {
                newHW++;
            }

            await Game.findOneAndUpdate(
                { guildID: guildId, season: seasonTracker.season, gameDef: isDefault },
                { $set: { totalGames: newTotal, agentWins: newAW, hackerWins: newHW } },
                { new: true }
            );

            // async function getUserData(user) {
            //     try {
            //         const response = await axios.get(`${process.env.CURRENT_SEASON_SHEET}/search?UserId=${user.userID}`);
            //         return response.data;
            //     } catch (error) {
            //         console.error(`Failed to get data for user ${user.username}:`, error);
            //         return [];
            //     }
            // }
            // console.log('reached');

            let sheet = process.env.CURRENT_SEASON_SHEET_DEF;
            if (!isDefault) {
                sheet = process.env.CURRENT_SEASON_SHEET_PARTY;
            }

            // Efficiently update Google Sheets
            const userDataBatch = [];

            // Retrieve all existing data in a single API call
            const allExistingDataResponse = await axios.get(`${sheet}`);
            const allExistingData = allExistingDataResponse.data;

            // Create a map for quick lookup
            const existingDataMap = new Map();
            allExistingData.forEach(data => {
                existingDataMap.set(data.UserId, data);
            });

            for (const e of playerArr) {
                const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON, gameDef: isDefault });
                const existingData = existingDataMap.get(user.userID);

                const userData = {
                    UserId: user.userID,
                    PlayerName: user.username,
                    SR: user.SR,
                    Rank: user.rank,
                    Wins: user.gamesWon,
                    Losses: user.gamesLost,
                    GamesPlayed: user.gamesWon + user.gamesLost,
                    WinRate: Math.floor((user.gamesWon / (user.gamesWon + user.gamesLost)) * 10000) / 100,
                    AgentWins: user.agentWins,
                    AgentLosses: user.agentLosses,
                    AgentGames: user.agentWins + user.agentLosses,
                    AgentWinrate: Math.floor((user.agentWins / (user.agentWins + user.agentLosses)) * 10000) / 100,
                    HackerWins: user.hackerWins,
                    HackerLosses: user.hackerLosses,
                    HackerGames: user.hackerWins + user.hackerLosses,
                    HackerWinrate: Math.floor((user.hackerWins / (user.hackerWins + user.hackerLosses)) * 10000) / 100
                };

                if (existingData) {
                    // Update the existing row using UserId
                    userDataBatch.push({ method: 'put', userId: user.userID, data: userData });
                } else {
                    // Insert a new row
                    userDataBatch.push({ method: 'post', data: userData });
                }
            }

            // Perform batch requests
            try {
                const batchRequests = userDataBatch.map(async (data) => {
                    if (data.method === 'put') {
                        return await axios.put(`${sheet}/UserId/${data.userId}`, { data: data.data });
                    } else {
                        return await axios.post(`${sheet}`, { data: [data.data] });
                    }
                });

                await Promise.all(batchRequests);
                console.log('Batch update/insert successful');
            } catch (batchError) {
                console.error('Error in batch update/insert:', batchError.response ? batchError.response.data : batchError.message);
            }


            // const userDataBatch = [];

            // const allExistingDataResponse = await axios.get(`${process.env.CURRENT_SEASON_SHEET}`);
            // const allExistingData = allExistingDataResponse.data;

            // const findExistingData = (userId) => {
            //     return allExistingData.find(data => data.UserId === userId);
            // };

            // for (const e of playerArr) {
            //     const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
            //     const existingData = findExistingData(user.userID);

            //     const userData = {
            //         UserId: user.userID,
            //         PlayerName: user.username,
            //         SR: user.SR,
            //         Wins: user.gamesWon,
            //         Losses: user.gamesLost,
            //         GamesPlayed: user.gamesWon + user.gamesLost,
            //         WinRate: (user.gamesWon / (user.gamesWon + user.gamesLost)) * 100,
            //         AgentWins: user.agentWins,
            //         AgentLosses: user.agentLosses, // Include AgentLosses
            //         AgentGames: user.agentWins + user.agentLosses,
            //         AgentWinrate: (user.agentWins / (user.agentWins + user.agentLosses)) * 100,
            //         HackerWins: user.hackerWins,
            //         HackerLosses: user.hackerLosses, // Include HackerLosses
            //         HackerGames: user.hackerWins + user.hackerLosses,
            //         HackerWinrate: (user.hackerWins / (user.hackerWins + user.hackerLosses)) * 100
            //     };

            //     if (existingData) {
            //         // Update the existing row using UserId
            //         userDataBatch.push({ method: 'put', userId: user.userID, data: userData });
            //     } else {
            //         // Insert a new row
            //         userDataBatch.push({ method: 'post', data: userData });
            //     }
            // }

            // try {
            //     const batchRequests = userDataBatch.map(async (data) => {
            //         if (data.method === 'put') {
            //             return await axios.put(`${process.env.CURRENT_SEASON_SHEET}/UserId/${data.userId}`, { data: data.data });
            //         } else {
            //             return await axios.post(process.env.CURRENT_SEASON_SHEET, { data: [data.data] });
            //         }
            //     });
            //     await Promise.all(batchRequests);
            //     console.log('Batch update/insert successful');
            // } catch (batchError) {
            //     console.error('Error in batch update/insert:', batchError.response ? batchError.response.data : batchError.message);
            // }
            
                // console.log("userData:", userData); // Debugging line to ensure data is correct
            
                // if (existingData.length > 0) {
                //     // Update the existing row using UserId
                //     const userId = existingData[0].UserId; // Assuming the returned object has a `UserId` field
                //     await axios.put(`${process.env.CURRENT_SEASON_SHEET}/UserId/${userId}`, {
                //         data: userData
                //     });
                // } else {
                //     // Insert a new row
                //     await axios.post(process.env.CURRENT_SEASON_SHEET, {
                //         data: [userData] // Wrap in an array
                //     });
                // }
            

            
            // handling mvp

            // const agentMVPButtons = [];
            // const hackerMVPButtons = [];
            // const buttonIds = [];
            // const agents = [];
            // const hackers = [];

            // if (agentsWon) { // if agentsWon then winners are green losers are red
            //     for (const e of winners) { // dealing with agent mvp
            //         const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
            //         const agentButton = new ButtonBuilder()
            //         .setLabel(`${user.username}`)
            //         .setStyle(ButtonStyle.Success)
            //         .setCustomId(`${user.userID}`);
            //         agentMVPButtons.push(agentButton);
            //         buttonIds.push(`${user.userID}`);
            //         agents.push(`${user.userID}`);
            //     }
            //     for (const e of losers) { // dealing with hacker mvp
            //         const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
            //         const hackerButton = new ButtonBuilder()
            //         .setLabel(`${user.username}`)
            //         .setStyle(ButtonStyle.Danger)
            //         .setCustomId(`${user.userID}`);
            //         hackerMVPButtons.push(hackerButton);
            //         buttonIds.push(`${user.userID}`);
            //         hackers.push(`${user.userID}`);
            //     }
            // }
            // else { // !agentsWon: winners are red losers are green
            //     for (const e of losers) { // dealing with agent mvp
            //         const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
            //         const agentButton = new ButtonBuilder()
            //         .setLabel(`${user.username}`)
            //         .setStyle(ButtonStyle.Success)
            //         .setCustomId(`${user.userID}`);
            //         agentMVPButtons.push(agentButton);
            //         buttonIds.push(`${user.userID}`);
            //         agents.push(`${user.userID}`);
            //     }
            //     for (const e of winners) { // dealing with hacker mvp
            //         const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
            //         const hackerButton = new ButtonBuilder()
            //         .setLabel(`${user.username}`)
            //         .setStyle(ButtonStyle.Danger)
            //         .setCustomId(`${user.userID}`);
            //         hackerMVPButtons.push(hackerButton);
            //         buttonIds.push(`${user.userID}`);
            //         hackers.push(`${user.userID}`);
            //     }
            // }

            // const mvpButtonRow = new ActionRowBuilder().addComponents(...agentMVPButtons, ...hackerMVPButtons);

            // const mvpVoter = await interaction.followUp({
            //     content: `Vote for your Agent and Hacker MVPs!`,
            //     components: [mvpButtonRow]
            // });

            // const totalPlayers = [...winners, ...losers];

            // const userValidityDict = [];

            // for (let i = 0; i < totalPlayers.length; i++) {
            //     userValidityDict.push({user: totalPlayers[i].player.user.id, counter: 0, votes: 0});
            // }
            // console.log(userValidityDict);

            // function checkUserExistence(userId) {
            //     for (let i = 0; i < userValidityDict.length; i++) {
            //         if (userValidityDict[i].user === userId) {
            //             return i; // Return index of the user
            //         }
            //     }
            //     return -1; // Return -1 if user ID not found
            // }

            // function checkUserCounter(userId) {
            //     for (const userObj of userValidityDict) {
            //         if (userObj.user === userId) {
            //             return userObj.counter; // Return counter value if user ID found
            //         }
            //     }
            //     return null; // Return null if user ID not found
            // }
            

            // const filter = (i) => {
            //     // Check if the interaction is a button click and if it's from the same user who sent the original command
            //     return i.isButton() && checkUserExistence(i.user.id) > -1;
            // };
            
            // const collector = mvpVoter.createMessageComponentCollector({
            //     componentType: ComponentType.Button, 
            //     filter,
            //     //time: 5_000 
            // });
            
            // let noOfVotes = 0;

            // collector.on('collect', async (buttonClick) => {
            //     await buttonClick.deferReply(); // Acknowledge the button click first
            //     const buttonClickId = buttonClick.customId;
            //     const u = buttonClick.user.id;
            //     if (buttonIds.includes(buttonClickId)) {
            //         if (checkUserCounter(u) === 0 || checkUserCounter(u) === 1) {
            //             noOfVotes++;
            //             buttonClick.followUp(`${noOfVotes} vote acquired`);
            //             userValidityDict[checkUserExistence(buttonClickId)].votes++;
            //             userValidityDict[checkUserExistence(u)].counter++;
            //             console.log(userValidityDict);
            //             console.log(noOfVotes);
            //         }
            //         else {
            //             buttonClick.followUp("You already voted once.")
            //             userValidityDict[checkUserExistence(u)].counter++;
            //         }
            //     }
            // });

            // if (noOfVotes === buttonIds.length) {
            //     console.log("computing");
            //     let agentMVP = userValidityDict[checkUserExistence(agents[0])];
            //     for(let i = 0; i < agents.length; i++) {
            //         const vote = userValidityDict[checkUserExistence(agents[i])].votes;
            //         if (vote > userValidityDict[checkUserExistence(agentMVP)].votes) {
            //             agentMVP = userValidityDict[checkUserExistence(agents[i])];
            //         }
            //     }
            //     let hackerMVP = userValidityDict[checkUserExistence(hackers[0])];
            //     for(let i = 0; i < hackers.length; i++) {
            //         const vote = userValidityDict[checkUserExistence(hackers[i])].votes;
            //         if (vote > userValidityDict[checkUserExistence(hackerMVP)].votes) {
            //             hackerMVP = userValidityDict[checkUserExistence(hackers[i])];
            //         }
            //     }
            //     interaction.followUp(`Agent MVP: <@${agentMVP}> \nHacker MVP: <@${hackerMVP}>`);
            // }
            
            

        } catch (error) {
            console.error("Failed to update:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;





