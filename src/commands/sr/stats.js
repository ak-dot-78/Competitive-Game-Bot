import Player from '../../schemas/Player.js';
import { ApplicationCommandOptionType,  EmbedBuilder } from 'discord.js';
import displaySeasonName from '../../utils/displaySeasonName.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "stats",
    description: "check a player's stats",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [
        {
            name: "user",
            description: "check their stats",
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: "season-id",
            description: "it's the season dawg",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Lifetime", value: "lifetime"},
                { name: "Pre-Season", value: "0000" },
                { name: "Season-1", value: "0001" }, 
                { name: "season-2", value: "0002"},
                { name: "season-3", value: "0003"}
            ]
        },
    ],
    callback: async (client, interaction) => {
        let userOption = interaction.options.getUser("user");
        let seasonId = interaction.options.getString('season-id');

        if (!userOption) {
            userOption = interaction.user;
        }

        if (!seasonId) {
            // eslint-disable-next-line no-undef
            seasonId = process.env.CURRENT_SEASON;
        }

        const userId = userOption.id;
        const guildId = interaction.guild.id;
        const displayName = displaySeasonName(seasonId, true);
        try {
            await interaction.deferReply(); // defer the initial reply
            const user = await Player.findOne({ userID: userId, guildID: guildId, season: seasonId });

            if (!user) {
                interaction.followUp(`<@${userId}> not found.`);
            }

            else {
                
                let statEmbed = new EmbedBuilder()
                .setTitle(`${userOption.username}'s ${displayName} Stats`)
                //.setImage(`attachment://${rankImage(user.rank)[1]}.png`)
                .addFields(
                    { name: ' Wins ' , value: `${user.gamesWon}`, inline: true},
                    { name: ' Losses ' , value: `${user.gamesLost}`, inline: true},
                    { name: ' Played ' , value: `${user.gamesLost + user.gamesWon}`, inline: true},
                    { name: ' Agent wins ' , value: `${user.agentWins}`, inline: true},
                    { name: ' Agent losses ' , value: `${user.agentLosses}`, inline: true},
                    { name: ' Agent games ' , value: `${user.agentLosses + user.agentWins}`, inline: true},
                    { name: ' Hacker wins ' , value: `${user.hackerWins}`, inline: true},
                    { name: ' Hacker losses ' , value: `${user.hackerLosses}`, inline: true},
                    { name: ' Hacker games ' , value: `${user.hackerLosses + user.hackerWins}`, inline: true},
                    { name: ' Agent win rate ' , value: `${Math.floor((user.agentWins * 100)/(user.agentWins + user.agentLosses))} %`, inline: true},
                    { name: ' Hacker win rate ' , value: `${Math.floor((user.hackerWins * 100)/(user.hackerWins + user.hackerLosses))} %`, inline: true},
                    { name: ' Total win rate ' , value: `${Math.floor((100 * user.gamesWon) / (user.gamesLost + user.gamesWon))} %`, inline: true},
                    { name: ' Agent MVPs ' , value: `${user.agentMVP}`, inline: true},
                    { name: ' Hacker MVPs ' , value: `${user.hackerMVP}`, inline: true},
                    { name: ' Total MVPs ' , value: `${user.hackerMVP + user.agentMVP}`, inline: true},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                await interaction.followUp({ embeds: [statEmbed]}); 
                console.log(`displayed ${userOption.username}'s ${seasonId} Stats`)
            }

        } catch (error) {
            console.error("Failed to check player card:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;