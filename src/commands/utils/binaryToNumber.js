import { codeBlock } from "discord.js";

function binToNum(str) {
    let result = 0;
    const binaryArr = str.split("").reverse();

    for(let i=0;i < binaryArr.length; i++) {
        const digit = Number(binaryArr[i]);
        if(isNaN(digit) || (digit !== 0 && digit !== 1)) {
            return "error";
        }
        result += digit * Math.pow(2,i);
    }

    return result;
}

export default {
    name: "binary-to-number",
    description: "Converts a binary to decimal",
    aliases: ["b2n"],

    async executeMessage(message,args,i18next) {
        const result = binToNum(args[0]);

        if (result === "error") {
            await message.channel.send(i18next.t("binaryToNumber.error.invalidBinary"));
            return;
        }

        const embed = {
            color: 0x3399ff,
            title: i18next.t("binaryToNumber.title"),
            fields: [
                {
                    name: i18next.t("binaryToNumber.fields.binaryInput"),
                    value: codeBlock(args[0])
                },
                {
                    name: i18next.t("binaryToNumber.resultOutput"),
                    value: codeBlock(result)
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

    async executeChatInput(interaction,i18next) {
        const result = binToNum(interaction.options.getString("input"));

        if (result === "error") {
            await interaction.reply({
                content: i18next.t("binaryToNumber.error.invalidBinary"),
                ephemeral: true
            });
            return;
        }

        const embed = {
            color: 0x3399ff,
            title: i18next.t("binaryToNumber.title"),
            fields: [
                {
                    name: i18next.t("binaryToNumber.fields.binaryInput"),
                    value: codeBlock(interaction.options.getString("input"))
                },
                {
                    name: i18next.t("binaryToNumber.fields.resultOutput"),
                    value: codeBlock(result)
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
                    description: "Input here"
                }
            ]
        })
    }
}