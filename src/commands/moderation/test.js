import { ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } from 'discord.js';

const addCommand = {
    name: "test",
    description: "test monkey",
    devOnly: true,
    // testOnly: Boolean, 
    // permissionsRequired: [PermissionFlagBits.Administrator],
    // botPermissions: [PermissionFlagBits.Administrator],
    callback: async (client, interaction) => {
        const userId = interaction.user.id;
        await interaction.deferReply();
        await interaction.followUp("I like noodles.");

        const testButton = new ButtonBuilder()
                    .setLabel(`noodles suck`)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`1`);
        
        

            const buttonRow = new ActionRowBuilder().addComponents(testButton);

            const mvpVoter = await interaction.followUp({
                content: `Do you like noodles?`,
                components: [buttonRow]
            });

            const userValidityDict = [{user: userId, counter: 0}];

            function checkUserExistence(userId) {
                for (let i = 0; i < userValidityDict.length; i++) {
                    if (userValidityDict[i].user === userId) {
                        return i; // Return index of the user
                    }
                }
                return -1; // Return -1 if user ID not found
            }

            function checkUserCounter(userId) {
                for (const userObj of userValidityDict) {
                    if (userObj.user === userId) {
                        return userObj.counter; // Return counter value if user ID found
                    }
                }
                return null; // Return null if user ID not found
            }
            

            const filter = (i) => {
                // Check if the interaction is a button click and if it's from the same user who sent the original command
                return i.isButton() && checkUserExistence(i.user.id) > -1;
            };
            
            const collector = mvpVoter.createMessageComponentCollector({
                componentType: ComponentType.Button, 
                filter,
                time: 10_000 // Timeout set to 10 seconds
            });
            
            collector.on('collect', async (buttonClick) => {
                await buttonClick.deferReply(); // Acknowledge the button click first
                const buttonClickId = buttonClick.customId;
                const u = buttonClick.user.id;
                if (buttonClickId === '1') {
                    if (checkUserCounter(u) === 0) {
                        buttonClick.followUp(`You have bad taste.`);
                        userValidityDict[checkUserExistence(u)].counter++;
                    }
                    else {
                        buttonClick.followUp("You already told me you hate noodles once :(")
                        userValidityDict[checkUserExistence(u)].counter++;
                    }
                }
            });
            
            collector.on('end', collected => {
                if (collected.size === 0) {
                    // If no interaction is collected within the specified time
                    mvpVoter.channel.send('Too late!');
                }
            });







}//command logic
};

export default addCommand;

