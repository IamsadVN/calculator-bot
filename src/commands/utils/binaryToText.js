import { codeBlock } from "discord.js";

function bitToText(str) {
    return [...str.split(/ +/g)].map((x) => String.fromCharCode(parseInt(x,2))).join("");
}

export default {
    name: "binary-to-text",
    aliases: ["b2t"],
    description: "Converts a binary string to a text",

    async executeMessage(message,args) {
        const binaryString = args.join(" ");

        const embed = {
            color: 0x3399ff,
            title: "Binary To Text",
            fields: [
                {
                    name: "Binary:",
                    value: codeBlock(binaryString)
                },
                {
                    name: "Kết quả:",
                    value: codeBlock(bitToText(binaryString))
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction) {
        const binaryString = interaction.options.getString("input");

        const embed = {
            color: 0x3399ff,
            title: "Binary To Text",
            fields: [
                {
                    name: "Binary:",
                    value: codeBlock(binaryString)
                },
                {
                    name: "Kết quả:",
                    value: codeBlock(bitToText(binaryString))
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "input",
                    type: 3,
                    description: "Input a binary right here"
                }
            ]
        })
    }
}