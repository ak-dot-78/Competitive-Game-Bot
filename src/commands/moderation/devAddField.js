/* eslint-disable no-unused-vars */
import { ApplicationCommandOptionType } from 'discord.js';
import determineTopTen from '../../utils/determineTopTen.js';
import Player from '../../schemas/Player.js';

const addCommand = {
    name: "devaddfield",
    description: "I say hi",
    // devOnly: true,
    // testOnly: Boolean, 
    // permissionsRequired: [PermissionFlagBits.Administrator],
    // botPermissions: [PermissionFlagBits.Administrator],
    callback: async (client, interaction) => {
        try {
          const players = await Player.updateMany(
            { season: 'lifetime', isDefault: { $exists: false } }, // Filter documents where season is 'lifetime' and isDefault does not exist
            { $set: { gameDef: true } } // Add the field isDefault with the value true
          );
          
        
            console.log(players);
          } catch (error) {
            console.error('Error updating documents:', error);
          } 
    }//command logic
};

export default addCommand;


