import { codeBlock } from "discord.js";

function numToBin(number) {
    let string = '';
    while(number > 0) {
        string = (number % 2) + string;
        number = Math.floor(number/2);
    }
    return string;
}

export default {
    name: "number-to-binary",
    aliases: ["n2b"],
    description: "Converts a number to binary",

    async executeMessage(message,args,i18next) {
        const number = Number(args[0]);

        const embed = {
            color: 0x3399ff,
            title: i18next.t("numberToBinary.title"),
            fields: [
                {
                    name: i18next.t("numberToBinary.fields.numberInput"),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("numberToBinary.fields.resultOutput"),
                    value: codeBlock(numToBin(number))
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
        })
    },

    async executeChatInput(interaction,i18next) {
        const number = interaction.options.getNumber("number");

        const embed = {
            color: 0x3399ff,
            title: i18next.t("numberToBinary.title"),
            fields: [
                {
                    name: i18next.t("numberToBinary.fields.numberInput"),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("numberToBinary.fields.resultOutput"),
                    value: codeBlock(numToBin(number))
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({embeds: [embed]});
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
                    description: "Vui lòng cho 1 con số vào đây"
                }
            ]
        })
    }
}