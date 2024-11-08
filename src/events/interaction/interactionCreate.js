import { getLang } from "../../../function/getLang.js";
import { commandLog } from "../../../function/log.js";
import i18next from "i18next";

export default {
    name: "interactionCreate",

    async execute(interaction) {
        const command = interaction.client.commands.find((command) =>
            Boolean(command.applicationCommands.find((data) =>
                data.name === interaction.commandName
            ))
        );
        
        //console.log(interaction.inCachedGuild());

        if (interaction.isChatInputCommand()) {
            if (!command) return;
            await command.executeChatInput?.(interaction,i18next);

            if (interaction.inCachedGuild()) commandLog(`${interaction.guild} / ${interaction.user.tag}`,command.name,"Slash Command");
            else commandLog(`Private Chat / ${interaction.user.tag}`,command.name,"Slash Command");
            
        }
        else if (interaction.isAutocomplete()) 
            await command.autocomplete(interaction,i18next);
    }
}