import { codeBlock } from "discord.js";

export default {
    name: 'pow',
    description: "pow (tôi hết idea để nghĩ ra description rồi)",

    async executeMessage(message, args) {
        const number = args[0];
        const exponential = args[1] || 2;

        const embed = {
            color: 0x3399ff,
            title: "Pow",
            fields: [
                {
                    name: "Number:",
                    value: codeBlock(number),
                    inline: true
                },
                {
                    name: "Exponential:",
                    value: codeBlock(exponential),
                    inline: true
                },
                {
                    name: "Result:",
                    value: codeBlock(Math.pow(number,exponential))
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [embed]
        });

    },

    async executeChatInput(interaction) {
        const number = interaction.options.getNumber("number");
        const exponential = interaction.options.getNumber("exponential") || 2;

        const embed = {
            color: 0x3399ff,
            title: "Pow",
            fields: [
                {
                    name: "Number:",
                    value: codeBlock(number),
                    inline: true
                },
                {
                    name: "Exponential:",
                    value: codeBlock(exponential),
                    inline: true
                },
                {
                    name: "Result:",
                    value: codeBlock(Math.pow(number,exponential))
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({
            embeds: [embed]
        })
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "number",
                    type: 10,
                    description: "Enter a number here"
                },
                {
                    name: "exponential",
                    type: 10,
                    description: "Enter a exponential here"
                }
            ]
        })
    }
}