/* eslint-disable no-unused-vars */
import { ApplicationCommandOptionType } from 'discord.js';
import determineTopTen from '../../utils/determineTopTen.js';

const addCommand = {
    name: "hey",
    description: "I say hi",
    // devOnly: true,
    // testOnly: Boolean, 
    // permissionsRequired: [PermissionFlagBits.Administrator],
    // botPermissions: [PermissionFlagBits.Administrator],
    callback: (client, interaction) => {interaction.reply("hi");}//command logic
};

export default addCommand;





