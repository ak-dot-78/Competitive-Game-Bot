import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

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
            
            const userOption = interaction.options.getUser("user");
            const typeOption = interaction.options.getString("type");

            const isAgent = typeOption === "agent" ? true : false;

            const userId = userOption.id;
            const guildId = interaction.guild.id;
            const user = await Rank.findOne( { userID: userId, guilID: guildId});

            const newMVP = isAgent ? [user.agentMVP + 1, user.hackerMVP] : [user.agentMVP, user.hackerMVP + 1];

            await Rank.findOneAndUpdate(
                { userID: userId, guildID: guildId },
                { $set: { agentMVP: newMVP[0], hackerMVP: newMVP[1] }},
                { new: true }
            );

            interaction.reply(`${user.username} now has ${user.agentMVP} agent MVP points and ${user.hackerMVP} hacker points. Congratulations!`);

        } catch (error) {
            console.error("Failed to update MVP:", error);
            await interaction.reply({ content: "There was an error processing your request.", ephemeral: true });
        }
    }
};

export default addCommand;
