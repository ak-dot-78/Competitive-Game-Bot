import Rank from '../../schemas/Rank.js';
import moment from 'moment';
import { ApplicationCommandOptionType,  EmbedBuilder, AttachmentBuilder } from 'discord.js';

const addCommand = {
    name: "rank",
    description: "check a player's rank",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [
        {
            name: "user",
            description: "check their rank",
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

                const userAvatar =  userOption.displayAvatarURL({ dynamic: true, size: 1024 });
                const lastGame = moment(user.lastGamePlayed).format('MMM D, YYYY, h:mm A');
                
                function rankEmote(rank) {
                    switch(rank) {
                        case 'NTF Agent':
                            return ':ntfagent:1221908227843948655';
                        case 'Cadet':
                            return ':cadet:1221908308907135006';
                        case 'Ensign':
                            return ':ensign:1221908337788977263';
                        case 'Lieutenant':
                            return ':lieutenant:1221908390129963118';
                        case 'Sergeant':
                            return ':sergeant:1221908522195882044';
                        case 'Master':
                            return ':master:1221908642987507732';
                    }
                }

                let rankEmbed = new EmbedBuilder()
                .setTitle(`${userOption.username}'s Season Stats`)
                .setThumbnail(`${userAvatar}`)
                //.setImage(`attachment://${rankImage(user.rank)[1]}.png`)
                .addFields(
                    { name: `${user.rank} <${rankEmote(user.rank)}>`, value: `${user.SR}` },
                    { name: ' Games won ' , value: `${user.gamesWon}`, inline: true},
                    { name: ' Games lost ' , value: `${user.gamesLost}`, inline: true},
                    { name: ' Last game played on ' , value: `${lastGame}\n (${moment(user.lastGamePlayed).fromNow()})`, inline: true},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                if (user.hammer) {
                    // const file = new AttachmentBuilder('../../../images/hammer.png');
                    rankEmbed
                   // .setImage(`attachment://hammer.png`)
                    .setDescription('<:hammer:1221908675980038266> hammer ');
                    await interaction.followUp({ embeds: [rankEmbed]}); 
                }

                //files: [file]

                else {
                    await interaction.followUp({ embeds: [rankEmbed]}); 
                }
                //files: [rankImage(user.rank)[0]]
            }

        } catch (error) {
            console.error("Failed to check player card:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;