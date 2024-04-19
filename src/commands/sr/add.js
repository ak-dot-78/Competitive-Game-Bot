import Player from '../../schemas/Player.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "add",
    description: "add a user to the leaderboards",
    // devOnly: true,
    // testOnly: Boolean, 
    // permissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "user",
            description: "user to be added",
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
            // check if the user already exists in the database (curr season)
            const existingUser = await Player.findOne({ userID: userId, guildID: guildId, season: process.env.CURRENT_SEASON });

            // check if user already exists in DB (lifetime season)
            const existingUserLifeTime = await Player.findOne({ userID: userId, guildID: guildId, season: "lifetime"});

            if (existingUser) {
                await interaction.followUp({content: "You're already on the leaderboard!", ephemeral: true});
            } else {
                const userObj = await client.users.fetch(userId);
                const newUser = new Player({
                    userID: userId,
                    guildID: guildId,
                    username: userObj.username,
                    season: process.env.CURRENT_SEASON
                });
                await newUser.save(); 
                await interaction.followUp({content: "You've been added!", ephemeral: true});
                console.log(`Added ${(await client.users.fetch(userId)).username} to ${process.env.CURRENT_SEASON} stats.`);
            }

            if (existingUserLifeTime) {
                console.log(`${(await client.users.fetch(userId)).username} already exists in lifetime stats.`)
            } else {
                const userObj = await client.users.fetch(userId);
                const newUser = new Player({
                    userID: userId,
                    guildID: guildId,
                    username: userObj.username,
                    season: "lifetime"
                });
                await newUser.save(); 
                console.log(`Added ${(await client.users.fetch(userId)).username} to lifetime stats.`);
            }
        } catch (error) {
            console.error("Failed to add user:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;