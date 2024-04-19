import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import Player from '../../schemas/Player.js';
import dotenv from 'dotenv';
dotenv.config();

const addCommand = {
    name: "mvp",
    description: "grant an mvp point to a user",
    // devOnly: true,
    // testOnly: Boolean, 
    permissionsRequired: [PermissionFlagsBits.Administrator],
    // botPermissions: [PermissionFlagBits.Administrator],
    options: [
        {
            name: "user",
            description: "give them an mvp",
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: "type",
            description: "agent mvp or hacker mvp?",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Agent", value: "agent" },
                { name: "Hacker", value: "hacker" }
            ],
            required: true
        }
    ],
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply(); // defer the initial reply
            let userOption = interaction.options.getUser("user");
    
            if (!userOption) {
                userOption = interaction.user;
            }
    
            const typeOption = interaction.options.getString("type");
            const isAgent = typeOption === "agent";
            console.log("isAgent:", isAgent);
    
            const userId = userOption.id;
            const guildId = interaction.guild.id;
            const user = await Player.findOne({ userID: userId, guildID: guildId, season: process.env.CURRENT_SEASON });
            const lifetimeUser = await Player.findOne({ userID: userId, guildID: guildId, season: "lifetime" });
    
            if (!user) {
                return interaction.followUp({ content: "User not found in the database.", ephemeral: true });
            }

            if (!lifetimeUser) {
                return interaction.followUp({ content: "User not found in the database.", ephemeral: true });
            }
    
            const updatedUser = await Player.findOneAndUpdate(
                { userID: userId, guildID: guildId, season: process.env.CURRENT_SEASON },
                isAgent ? { $inc: { agentMVP: 1 } } : { $inc: { hackerMVP: 1 } },
                { new: true }
            );

            await Player.findOneAndUpdate(
                { userID: userId, guildID: guildId, season: "lifetime" },
                isAgent ? { $inc: { agentMVP: 1 } } : { $inc: { hackerMVP: 1 } },
                { new: true }
            );
    
            interaction.followUp(`${updatedUser.username} now has ${updatedUser.agentMVP} agent MVPs and ${updatedUser.hackerMVP} hacker MVPs.`);
            console.log(`MVP updated for ${updatedUser.username} in current and lifetime`);
        } catch (error) {
            console.error("Failed to update MVP:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
}
export default addCommand;
