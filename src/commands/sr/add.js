import Rank from '../../schemas/Rank.js';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

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
            // check if the user already exists in the database
            const existingUser = await Rank.findOne({ userID: userId, guildID: guildId });

            if (existingUser) {
                await interaction.followUp({content: "You're already on the leaderboard!", ephemeral: true});
            } else {
                const userObj = await client.users.fetch(userId);
                const newUser = new Rank({
                    userID: userId,
                    guildID: guildId,
                    username: userObj.username,
                });
                await newUser.save(); 
                await interaction.followUp({content: "You've been added!", ephemeral: true});
            }
        } catch (error) {
            console.error("Failed to add user:", error);
            await interaction.followUp({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;