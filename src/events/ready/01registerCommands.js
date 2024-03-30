import config from '../../../config.json' assert { type: 'json' };

const { availableServers } = config; // experimental possible bug

import areCommandsDifferent from '../../utils/areCommandsDifferent.js';
import getApplicationCommands from '../../utils/getApplicationCommands.js';
import getLocalCommands from '../../utils/getLocalCommands.js';


export default async (client) => {
    try {
        const localCommands = await getLocalCommands();
        for (const gs of availableServers){
            const applicationCommands = await getApplicationCommands(client, gs);
            
            for (const localCommand of localCommands) {
                const {name, description, options} = localCommand;
                const existingCommand = await applicationCommands.cache.find(
                    (cmd) => cmd.name === name
                )

                if (existingCommand) {
                    if (localCommand.deleted) {
                        await applicationCommands.delete(existingCommand.id);
                        console.log(`Deleted command ${name}`);
                        continue;
                    }

                    if (areCommandsDifferent(existingCommand, localCommand)) {
                        await applicationCommands.edit(existingCommand.id, {description, options,});
                        console.log(`Modified command ${name}`);
                    }
                }
                else {
                    if (localCommand.deleted) {
                        console.log(`Skipping registering command ${name} as it is set to delete`);
                        continue;
                    }

                    await applicationCommands.create({
                        name, description, options,
                    });
                    console.log(`Registered command ${name}`);

                }
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
};