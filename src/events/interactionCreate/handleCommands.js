import config from '../../../config.json' assert { type: 'json' };
import getLocalCommands from '../../utils/getLocalCommands.js';

const { devs, testServer } = config; // experimental possible bug


export default async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const localCommands = await getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!(devs.includes(interaction.user.id))) {
                interaction.reply({content: "Only developers are allowed to run this command.", ephemeral: true,});
                return;
            }
        }

        if (commandObject.testOnly) {
            if (!interaction.guild.id === testServer) {
                interaction.reply({content: "You cannot run this command here.", ephemeral: true, });
                return;
            }
        }

        if (commandObject.permissionRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enough user permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions to do that.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log("There was an error.")    
    }
};