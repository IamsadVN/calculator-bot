import { codeBlock } from "discord.js";

function calculateTime(inputSeconds) {
    const hours = Math.floor(inputSeconds / 3600);
    const minutes = Math.floor((inputSeconds % 3600) / 60);
    const seconds = inputSeconds % 60;

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

export default {
    name: "ping",
    aliases: ["lag","check","info"],
    description: "Kiểm tra tốc độ phản hồi của Casio fx-580VN X",


    async executeMessage(message) {
        const embed = {
            color: 0x3399ff,
            author: {
                name: "Pong 🏓",
                icon_url: `${message.client.user.displayAvatarURL({size: 64})}`
            },
            fields: [
                {
                    name: "Uptime:",
                    value: `${codeBlock(`[${calculateTime(Math.round(process.uptime()))}]`)}`,
                    inline: true
                },
                {
                    name: "Lantency:",
                    value: `${codeBlock(`${message.client.ws.ping}ms`)}`,
                    inline: true
                }
            ],
            footer: {
                text: `${message.author.username}`,
                icon_url: `${message.author.displayAvatarURL({size: 64})}`
            },
            timestamp: new Date().toISOString()
        }

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction) {
        //console.log(interaction.client);
        const embed = {
            color: 0x3399ff,
            author: {
                name: "Pong 🏓",
                icon_url: `${interaction.client.user.displayAvatarURL({size: 64})}`
            },
            fields: [
                {
                    name: "Uptime:",
                    value: `${codeBlock(`[${calculateTime(Math.round(process.uptime()))}]`)}`,
                    inline: true
                },
                {
                    name: "Lantency:",
                    value: `${codeBlock(`${interaction.client.ws.ping}ms`)}`,
                    inline: true
                }
            ],
            footer: {
                text: `${interaction.user.tag}`,
                icon_url: `${interaction.user.displayAvatarURL({size: 64})}`
            },
            timestamp: new Date().toISOString()
        }

        await interaction.reply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push(
            {
                name: this.name,
                description: this.description,
            }
        );
    }
}