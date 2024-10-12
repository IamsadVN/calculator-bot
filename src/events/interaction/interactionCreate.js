import { commandLog } from "../../../function/log.js";

export default {
    name: "interactionCreate",

    async execute(interaction) {
        const command = interaction.client.commands.find((command) =>
            Boolean(command.applicationCommands.find((data) =>
                data.name === interaction.commandName
            ))
        );

        if (interaction.isChatInputCommand()) {
            if (!command) return;
            await command.executeChatInput?.(interaction);
            commandLog(interaction.user.tag,command.name,"Slash Command");
        }
        else if (interaction.isAutocomplete()) 
            await command.autocomplete(interaction);
    }
}