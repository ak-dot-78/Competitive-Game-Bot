import { ApplicationCommandOptionType } from 'discord.js';
import determineTopTen from '../../utils/determineTopTen.js';

const addCommand = {
    name: "srchange",
    description: "increases SR of given player by given amount",
    devOnly: true,
    testOnly: false, 
    permissionsRequired: [PermissionFlagBits.Administrator],
    botPermissions: [PermissionFlagBits.Administrator],
    options: [
        {
            name: "player",
            description: "player to affect",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "amount",
            description: "amount to increase",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply(); // defer the initial reply


            const player = interaction.options.getMentionable(`player`);
            const amount = interaction.options.getString(`amount`);
            const guildId = interaction.guild.id;
            const userId = player.id;

            const user = await Rank.findOne({ userID: userId, guildID: guildId });

            const newSR = user.SR + amount;

            await Rank.findOneAndUpdate(
                { userID: userId, guildID: guildId },
                { $set: { SR: newSR } },
                { new: true }
            );

            await interaction.followUp("boing");

        } catch (error) {
            console.error("Failed to srchange: ", error);
            await interaction.reply({ content: "boing did not work", ephemeral: false });
        }
    }
};

export default addCommand;





