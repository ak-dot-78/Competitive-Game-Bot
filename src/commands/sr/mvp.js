import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import Rank from '../../schemas/Rank.js';

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
            const user = await Rank.findOne({ userID: userId, guildID: guildId });
    
            if (!user) {
                return interaction.followUp({ content: "User not found in the database.", ephemeral: true });
            }
    
            const updatedUser = await Rank.findOneAndUpdate(
                { userID: userId, guildID: guildId },
                isAgent ? { $inc: { agentMVP: 1 } } : { $inc: { hackerMVP: 1 } },
                { new: true }
            );
    
            interaction.followUp(`${updatedUser.username} now has ${updatedUser.agentMVP} agent MVPs and ${updatedUser.hackerMVP} hacker MVPs.`);
        } catch (error) {
            console.error("Failed to update MVP:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
}
export default addCommand;
