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
                
                function rankImage(rank) {
                    switch(rank) {
                        case 'NTF Agent':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/ntf.png'), 'ntf'];
                        case 'Cadet':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/cadet.png'), 'cadet'];
                        case 'Ensign':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/ensign.png'), 'ensign'];
                        case 'Lieutenant':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/liue.png'), 'liue'];
                        case 'Sergeant':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/serg.png'), 'serg'];
                        case 'Master':
                            return [new AttachmentBuilder('C:/Users/17863/elo/images/mas.png'), 'mas'];
                    }
                }

                let rankEmbed = new EmbedBuilder()
                .setTitle(`${userOption.username}'s Season Stats`)
                .setThumbnail(`${userAvatar}`)
                .setImage(`attachment://${rankImage(user.rank)[1]}.png`)
                .addFields(
                    { name: `${user.rank}`, value: `${user.SR}` },
                    { name: ' Games won ' , value: `${user.gamesWon}`, inline: true},
                    { name: ' Games lost ' , value: `${user.gamesLost}`, inline: true},
                    { name: ' Last game played on ' , value: `${lastGame}\n (${moment(user.lastGamePlayed).fromNow()})`, inline: true},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                if (user.hammer) {
                    const file = new AttachmentBuilder('C:/Users/17863/elo/images/hammer.png');
                    rankEmbed
                    .setImage(`attachment://hammer.png`)
                    .setDescription(':hammer:hammer:hammer: ');
                    await interaction.followUp({ embeds: [rankEmbed] ,  files: [file]}); 
                }

                else {
                    await interaction.followUp({ embeds: [rankEmbed] ,  files: [rankImage(user.rank)[0]]}); 
                }

            }

        } catch (error) {
            console.error("Failed to check player card:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;