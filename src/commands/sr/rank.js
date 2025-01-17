import Player from '../../schemas/Player.js';
import moment from 'moment';
import { ApplicationCommandOptionType,  EmbedBuilder } from 'discord.js';
import displaySeasonName from '../../utils/displaySeasonName.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "rank",
    description: "check a player's rank",
    // devOnly: true,
    // testOnly: Boolean, 
    options: [
        {
            name: "gamemode",
            description: "mainframe? blind hackers? normal? hacker vc? blitz? timer?",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Default", value: "default"},
                { name: "Party", value: "variety"}
            ],
            required: true
        },
        {
            name: "user",
            description: "check their rank",
            type: ApplicationCommandOptionType.Mentionable,
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
        },
    ],
    callback: async (client, interaction) => {
        let userOption = interaction.options.getUser("user");
        let seasonId = interaction.options.getString('season-id');
        let gameMode = interaction.options.getString("gamemode");

        let isDefault = true;

        if (gameMode === "variety") {
            isDefault = false;
        }


        if (!userOption) {
            userOption = interaction.user;
        }

        if (!seasonId) {
            // eslint-disable-next-line no-undef
            seasonId = process.env.CURRENT_SEASON;
        }

        const userId = userOption.id;
        const guildId = interaction.guild.id;
        const displayName = displaySeasonName(seasonId, isDefault);
        console.log(displayName);
        try {
            await interaction.deferReply(); // defer the initial reply
            const user = await Player.findOne({ userID: userId, guildID: guildId, season: seasonId, gameDef: isDefault });

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
                .setTitle(`${userOption.username}'s ${displayName} Player Card`)
                .setThumbnail(`${userAvatar}`)
                //.setImage(`attachment://${rankImage(user.rank)[1]}.png`)
                .addFields(
                    { name: `${user.rank} <${rankEmote(user.rank)}>`, value: `${user.SR}` },
                    { name: ' Games won ' , value: `${user.gamesWon}`, inline: true},
                    { name: ' Games lost ' , value: `${user.gamesLost}`, inline: true},
                    { name: ' Hammer status' , value: 'cringe :grimacing:', inline: true},
                    { name: ' Last game played on ' , value: `${lastGame}\n (${moment(user.lastGamePlayed).fromNow()})`, inline: true},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                if (user.hammer) {
                    let rankEmbed1 = new EmbedBuilder()
                    .setTitle(`${userOption.username}'s Season Stats`)
                    .setThumbnail(`${userAvatar}`)
                    //.setImage(`attachment://${rankImage(user.rank)[1]}.png`)
                    .addFields(
                    { name: `${user.rank} <${rankEmote(user.rank)}>`, value: `${user.SR}` },
                    { name: ' Games won ' , value: `${user.gamesWon}`, inline: true},
                    { name: ' Games lost ' , value: `${user.gamesLost}`, inline: true},
                    { name: ' Hammer status' , value: 'based <:hammer:1221908675980038266>', inline: true},
                    { name: ' Last game played on ' , value: `${lastGame}\n (${moment(user.lastGamePlayed).fromNow()})`, inline: true},
                    )
                    
                    await interaction.followUp({ embeds: [rankEmbed1]});
                }
                
                    // // const file = new AttachmentBuilder('../../../images/hammer.png');
                    // rankEmbed
                    // .setTitle(`${userOption.username}'s Season Stats`)
                    // // .setImage(`attachment://hammer.png`)
                    // // .setDescription('<:hammer:1221908675980038266> hammer ');
                    // await interaction.followUp({ embeds: [rankEmbed]}); 
                

                //files: [file]

                else {
                    await interaction.followUp({ embeds: [rankEmbed]}); 
                }
                console.log("displayed player's rank card")
                //files: [rankImage(user.rank)[0]]
            }

        } catch (error) {
            console.error("Failed to check player card:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;