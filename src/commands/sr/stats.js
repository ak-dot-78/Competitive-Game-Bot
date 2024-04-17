import Rank from '../../schemas/Rank.js';
import { ApplicationCommandOptionType,  EmbedBuilder, AttachmentBuilder } from 'discord.js';

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
    ],
    callback: async (client, interaction) => {
        let userOption = interaction.options.getUser("user");

        if (!userOption) {
            userOption = interaction.user;
        }

        const userId = userOption.id;
        const guildId = interaction.guild.id;
        try {
            await interaction.deferReply(); // defer the initial reply
            const user = await Rank.findOne({ userID: userId, guildID: guildId });

            if (!user) {
                interaction.followUp(`<@${userId}> not found.`);
            }

            else {
                
                let statEmbed = new EmbedBuilder()
                .setTitle(`${userOption.username}'s Season Stats`)
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
                    { name: ' Agent win rate ' , value: `${(user.agentWins * 100)/(user.agentWins + user.agentLosses)}`, inline: true},
                    { name: ' Hacker win rate ' , value: `${(user.hackerWins * 100)/(user.hackerWins + user.hackerLosses)}`, inline: true},
                    { name: ' Total win rate ' , value: `${(100 * user.gamesWon) / (user.gamesLost + user.gamesWon)}`, inline: true},
                    { name: ' Agent MVPs ' , value: `${user.agentMVP}`, inline: true},
                    { name: ' Hacker MVPs ' , value: `${user.hackerMVP}`, inline: true},
                    { name: ' Total MVPs ' , value: `${user.hackerMVP + user.agentMVP}`, inline: true},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                await interaction.followUp({ embeds: [statEmbed]}); 
            }

        } catch (error) {
            console.error("Failed to check player card:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;