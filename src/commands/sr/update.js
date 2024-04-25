import Player from '../../schemas/Player.js';
import determineHammer from '../../utils/determineHammer.js';
import determineRank from '../../utils/determineRank.js';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ComponentType, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import determineWinLossNumber from '../../utils/determineWinLossNumber.js';
import determineLastPlayed from '../../utils/determineLastPlayed.js';
import determineWinnersLosers from '../../utils/determineWinnersLosers.js';
import determineAgentHackerWinLoss from '../../utils/determineAgentHackerWinLoss.js';
import determineSR from '../../utils/determineSR.js';
import dotenv from 'dotenv';
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
            required: false,
        },
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
    ],
    callback: async (client, interaction) => { 
        try {
            let gameMode = interaction.options.getString("gamemode");
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

            if (!gameMode) {
                gameMode = "normal";
            }

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
                await determineSR(client, e.player.user.id, guildId, process.env.CURRENT_SEASON, true);
                await determineWinLossNumber(e.player.user.id, guildId, process.env.CURRENT_SEASON, true);
                await determineSR(client, e.player.user.id, guildId, "lifetime", true);
                await determineWinLossNumber(e.player.user.id, guildId, "lifetime", true);
            }
            for (const e of losers) {
                await determineSR(client, e.player.user.id, guildId, process.env.CURRENT_SEASON, false);
                await determineWinLossNumber(e.player.user.id, guildId, process.env.CURRENT_SEASON, false);
                await determineSR(client, e.player.user.id, guildId, "lifetime", false);
                await determineWinLossNumber(e.player.user.id, guildId, "lifetime", false);
            }
            await determineAgentHackerWinLoss(winners, guildId, process.env.CURRENT_SEASON, agentsWon);
            await determineAgentHackerWinLoss(losers, guildId, process.env.CURRENT_SEASON, agentsWon);
            await determineAgentHackerWinLoss(winners, guildId, "lifetime", agentsWon);
            await determineAgentHackerWinLoss(losers, guildId, "lifetime", agentsWon);
            winners.concat(...losers).forEach(e => {
                determineRank(e.player.user.id, guildId, process.env.CURRENT_SEASON,);
                const timestamp = new Date();
                determineLastPlayed(e.player.user.id, guildId, process.env.CURRENT_SEASON, timestamp);
            });
            await determineHammer(guildId, process.env.CURRENT_SEASON);
            await determineHammer(guildId, "lifetime");
            for (const e of  winners.concat(...losers)) {
                const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
                feedback += `Updated SR for ${user.username}. You now have: ${user.SR}\n`; // provide feedback for each player's update
            }
            await interaction.followUp({
                content: feedback + `Successfully updated SR for all players`,
            });

            // handling mvp

            const agentMVPButtons = [];
            const hackerMVPButtons = [];
            let counter = '1';

            if (agentsWon) { // if agentsWon then winners are green losers are red
                for (const e of winners) { // dealing with agent mvp
                    const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
                    const agentButton = new ButtonBuilder()
                    .setLabel(`${user.username}`)
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`${counter}-${user.userID}`);
                    counter++;
                    agentMVPButtons.push(agentButton);
                    console.log(`${counter}-${user.userID}`);
                }
                for (const e of losers) { // dealing with hacker mvp
                    const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
                    const hackerButton = new ButtonBuilder()
                    .setLabel(`${user.username}`)
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`${counter}-${user.userID}`);
                    counter++;
                    hackerMVPButtons.push(hackerButton);
                }
            }
            else { // !agentsWon: winners are red losers are green
                for (const e of losers) { // dealing with agent mvp
                    const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
                    const agentButton = new ButtonBuilder()
                    .setLabel(`${user.username}`)
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`${counter}-${user.userID}`);
                    counter++;
                    agentMVPButtons.push(agentButton);
                }
                for (const e of winners) { // dealing with hacker mvp
                    const user = await Player.findOne({ userID: e.player.user.id, guildID: guildId, season: process.env.CURRENT_SEASON });
                    const hackerButton = new ButtonBuilder()
                    .setLabel(`${user.username}`)
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`${counter}-${user.userID}`);
                    counter++;
                    hackerMVPButtons.push(hackerButton);
                }
            }

            const mvpButtonRow = new ActionRowBuilder().addComponents(...agentMVPButtons, ...hackerMVPButtons);

            const mvpVoter = await interaction.followUp({
                content: `Vote for your Agent and Hacker MVPs!`,
                components: [mvpButtonRow]
            });

            const interactedUsers = new Set();

            const filter = (i) => {
                if (winners.concat(...losers).includes(i.user.id) && !interactedUsers.has(i.user.id)) {
                    interactedUsers.add(i.user.id);
                    return true;
                }
                return false;
            };

            const collector = mvpVoter.createMessageComponentCollector({
                componentType: ComponentType.Button, 
                filter,
                //time: 10_000
            });

            collector.on('collect', async (buttonClick) => {
                await buttonClick.deferReply(); // Acknowledge the button click first
                const buttonClickId = buttonClick.customId;
                // const buttonOptions = winners.concat(...losers);
                // const [index, userId] = buttonClick.customId.split('-'); // Extracting index from ID
                // console.log(index);
                if (buttonClickId === '1-1218027044869509260') {
                    buttonClick.followUp({ content: `You clicked on: ${selectedUser.player.user.username}`, ephemeral: true });
                }

                // if (!isNaN(index) && parseInt(index) > 0 && parseInt(index) <= winners.concat(losers).length) {
                //     const selectedUser = winners.concat(losers)[parseInt(index) - 1]; // Accessing the selected user based on index
                //     // Confirm the userId matches the button clicked
                //     if (selectedUser.player.user.id === userId) {
                //         buttonClick.followUp({ content: `You clicked on: ${selectedUser.player.user.username}`, ephemeral: true });
                //     } else {
                //         buttonClick.followUp({ content: 'There was a mismatch with the user data.', ephemeral: true });
                //     }
                // } else {
                //     buttonClick.followUp({ content: 'This button is not recognized!', ephemeral: true });
                // }
            });
        } catch (error) {
            console.error("Failed to update:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;





